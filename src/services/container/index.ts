import initDebug from 'debug';
import {
    createContainer,
    execScenarioContainer,
    startContainer,
    stopContainer,
} from './execScenarioContainer.js';
import getContainerStatsIfRunning from './getContainerStats.js';

import {
    CONTAINER_DEVICE_NAME,
    CONTAINER_TYPES,
    DEFAULT_SAMPLES,
} from '../../constants.js';
import type { ValueOf } from '../../types.js';
import { getPodsStats } from './getPodsStats.js';
import { mergePodStatsWithNetworkStats } from './kubernetes/mergePodStatsWithNetworkStats.js';
import { CadvisorContainerStats } from './kubernetes/stats.js';
import { getNodes } from './kubernetes/structureNodes.js';

const debug = initDebug('greenframe:services:container');

export type kubernetesStats = {
    stats: CadvisorContainerStats[];
    sample: number;
    timelines: any;
}[];

export type KubernetesRuns = {
    [key: string]: {
        name: string;
        type: ValueOf<typeof CONTAINER_TYPES>;
        kubernetesStats: kubernetesStats;
    };
};

export const executeScenarioAndGetContainerStats = async ({
    scenario,
    url,
    samples = DEFAULT_SAMPLES,
    useAdblock,
    ignoreHTTPSErrors,
    locale,
    timezoneId,
    containers = [],
    databaseContainers = [],
    kubeContainers = [],
    kubeDatabaseContainers = [],
    extraHosts = [],
    envVars = [],
    envFile = '',
    dockerdHost,
    dockerdPort,
}: {
    scenario: string;
    url: string;
    samples?: number;
    useAdblock?: boolean;
    ignoreHTTPSErrors?: boolean;
    locale?: string;
    timezoneId?: string;
    containers?: string[] | string;
    databaseContainers?: string[] | string;
    kubeContainers?: string[];
    kubeDatabaseContainers?: string[];
    extraHosts?: string[];
    envVars?: string[];
    envFile?: string;
    dockerdHost?: string;
    dockerdPort?: number;
}) => {
    try {
        debug('Starting container');
        await stopContainer();
        await createContainer(extraHosts, envVars, envFile);
        await startContainer();
        debug('Container started');
        let allContainers: {
            name: string;
            type: ValueOf<typeof CONTAINER_TYPES>;
            kubernetesStats?: kubernetesStats;
            dockerStats?: any[];
            stopContainerStats?: () => unknown;
        }[] = [
            {
                name: CONTAINER_DEVICE_NAME,
                type: CONTAINER_TYPES.DEVICE,
                dockerStats: [],
            },
        ];

        if (typeof containers === 'string') {
            containers = containers.split(',');
        }

        const allMilestones = [];

        allContainers = allContainers.concat(
            containers.map((container) => ({
                name: container,
                type: CONTAINER_TYPES.SERVER,
                dockerStats: [],
            }))
        );

        if (typeof databaseContainers === 'string') {
            databaseContainers = databaseContainers.split(',');
        }

        allContainers = allContainers.concat(
            databaseContainers.map((container) => ({
                name: container,
                type: CONTAINER_TYPES.DATABASE,
                dockerStats: [],
            }))
        );

        const nodes =
            (kubeContainers && kubeContainers.length > 0) ||
            (kubeDatabaseContainers && kubeDatabaseContainers.length > 0)
                ? await getNodes(kubeContainers, kubeDatabaseContainers)
                : {};
        const kubernetesResults: {
            [key: string]: {
                name: string;
                type: ValueOf<typeof CONTAINER_TYPES>;
                kubernetesStats: kubernetesStats;
            };
        } = {};

        for (let sample = 1; sample <= samples; sample++) {
            debug('Getting stats for sample', sample);
            for (const container of allContainers) {
                const stopContainerStats = await getContainerStatsIfRunning(
                    container.name,
                    { dockerdHost, dockerdPort }
                );
                container.stopContainerStats = stopContainerStats;
            }

            const stop = getPodsStats(nodes);

            const { timelines, milestones } = await execScenarioContainer(scenario, url, {
                useAdblock,
                ignoreHTTPSErrors,
                locale,
                timezoneId,
            });

            allMilestones.push(milestones);

            allContainers = allContainers.map((container) => {
                if (!container.stopContainerStats) {
                    throw new Error(
                        `Can't stop container ${container.name}, command not found`
                    );
                }

                const containerStats = container.stopContainerStats();
                container.stopContainerStats = undefined;
                container.dockerStats?.push({
                    sample,
                    stats: containerStats,
                    timelines,
                });

                return container;
            });

            const kubernetesStats = stop();

            for (const result of Object.values(kubernetesStats)) {
                if (!kubernetesResults[result.podName]) {
                    kubernetesResults[result.podName] = {
                        name: result.podName,
                        type: result.podType,
                        kubernetesStats: [],
                    };
                }

                kubernetesResults[result.podName].kubernetesStats.push({
                    stats: result.stats,
                    sample,
                    timelines,
                });
            }
        }

        mergePodStatsWithNetworkStats(nodes, kubernetesResults);
        allContainers = [...allContainers, ...Object.values(kubernetesResults)];
        debug('Returning', allContainers.length);
        return { allContainers, allMilestones };
    } catch (error) {
        debug('Error', error);
        throw error;
    } finally {
        await stopContainer();
    }
};
