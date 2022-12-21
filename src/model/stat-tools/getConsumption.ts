import { std } from 'mathjs';
import { computeStats } from './docker/computeStats';
import {
    getMetricsPerContainerPerSamples,
    getMetricsPerContainer,
    addMetricsContainer,
} from './getWh';
import { docker } from './providers/docker';
import { kubernetes } from './providers/kubernetes';
import { createStatStore } from '../stores/statStore';
import type {
    CadvisorContainerStats,
    ComputedStatWithMeta,
    DockerStatsJSON,
    MetricsContainer,
    TimeFrame,
    ValueOf,
} from '../../types';
import type { CONTAINER_TYPES } from '../../constants';
const getStandardError = (totalWhBySamples: number[], totalWhMean: number) => {
    // Calculate the standard deviation and divide it by the sqrt of number of samples.
    // Compute it in percentage of the totalScore
    return (
        ((std(totalWhBySamples) / Math.sqrt(totalWhBySamples.length)) * 100) / totalWhMean
    );
};

const getComputedStats = (
    containerName: string,
    containerType: ValueOf<typeof CONTAINER_TYPES>,
    stats: DockerStatsJSON[] | CadvisorContainerStats[],
    timelines: TimeFrame,
    sample: number,
    isKubernetes?: boolean
) => {
    const containerProvider = isKubernetes ? kubernetes : docker;
    const meta = { container: containerName, sample, type: containerType };
    try {
        // @ts-expect-error TS doesn't know that the provider is a docker or kubernetes provider
        // So it add both types of stats in the method computeGenericStats
        const genericStats = containerProvider.computeGenericStats(stats);

        const computedStats = computeStats({
            stats: genericStats,
            timeframes: [
                {
                    start: new Date(timelines.start),
                    end: new Date(timelines.end),
                    title: timelines.title,
                },
            ],
            meta,
        });

        return computedStats;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const getScenarioConsumption = (
    stats: ComputedStatWithMeta[],
    isMultiContainers = false
) => {
    const store = createStatStore(stats);

    const consumption = {
        HDD: 0.89,
        SSD: 1.52,
        NETWORK: 11,
        CORE_I7: 45,
        SCREEN_27: 30,
        SCREEN_14: 14,
        MEM_128: 10,
    };
    const energyProfile = {
        CPU: consumption.CORE_I7,
        MEM: consumption.MEM_128 / 128,
        DISK: consumption.SSD / 1000,
        NETWORK: isMultiContainers ? consumption.NETWORK : consumption.NETWORK * 2, // to compensate div2 from model
        PUE: 1.4,
        SCREEN: consumption.SCREEN_14,
    };

    const metricsPerContainerPerSamples = getMetricsPerContainerPerSamples(
        store,
        energyProfile
    );

    const containers = Object.keys(metricsPerContainerPerSamples);
    const totalWhPerSamples = containers.reduce<number[]>((acc, containerName) => {
        metricsPerContainerPerSamples[containerName].forEach(
            (metrics: MetricsContainer, sample: number) => {
                acc[sample] = acc[sample]
                    ? acc[sample] + metrics.wh.total
                    : metrics.wh.total;
            }
        );
        return acc;
    }, []);

    const metricsPerContainer = getMetricsPerContainer(store, energyProfile);

    let totalScore: MetricsContainer = undefined as unknown as MetricsContainer;
    for (const key in metricsPerContainer) {
        if (Object.hasOwnProperty.call(metricsPerContainer, key)) {
            const element = metricsPerContainer[key];
            totalScore = addMetricsContainer(totalScore, element);
        }
    }

    // addMetricsContainer computes the sum of all metrics for all containers.
    // The totalTime should contain the average time for the scenario across all containers
    // not the sum of the time spent on all containers.
    // eslint-disable-next-line operator-assignment
    totalScore.s.totalTime =
        totalScore.s.totalTime / Object.keys(metricsPerContainer).length;
    const precision = getStandardError(totalWhPerSamples, totalScore.wh.total);

    return { totalScore, precision, metricsPerContainer };
};

const getStats = (
    allContainersStats: {
        name: string;
        type: ValueOf<typeof CONTAINER_TYPES>;
        dockerStats?: {
            stats: DockerStatsJSON[];
            timelines: TimeFrame;
            sample: number;
        }[];
        kubernetesStats?: {
            stats: CadvisorContainerStats[];
            timelines: TimeFrame;
            sample: number;
        }[];
        computedStats?: ComputedStatWithMeta[];
    }[]
) => {
    return allContainersStats.reduce<ComputedStatWithMeta[]>(
        (
            acc: ComputedStatWithMeta[],
            container: {
                name: string;
                type: ValueOf<typeof CONTAINER_TYPES>;
                dockerStats?: {
                    stats: DockerStatsJSON[];
                    timelines: TimeFrame;
                    sample: number;
                }[];
                kubernetesStats?: {
                    stats: CadvisorContainerStats[];
                    timelines: TimeFrame;
                    sample: number;
                }[];
                isKubernetes?: boolean;
            },
            index: number
        ) => {
            const dockerContainerStats = container.dockerStats
                ? container.dockerStats.reduce(
                      (
                          acc: ComputedStatWithMeta[],
                          {
                              stats,
                              timelines,
                              sample,
                          }: {
                              stats: DockerStatsJSON[];
                              timelines: TimeFrame;
                              sample: number;
                          }
                      ) => {
                          const computedStats = getComputedStats(
                              container.name,
                              container.type,
                              stats,
                              timelines,
                              sample
                          );
                          return acc.concat(...computedStats);
                      },
                      []
                  )
                : [];
            const kubernetesContainerStats = container.kubernetesStats
                ? container.kubernetesStats.reduce(
                      (
                          acc: ComputedStatWithMeta[],
                          {
                              stats,
                              timelines,
                              sample,
                          }: {
                              stats: CadvisorContainerStats[];
                              timelines: TimeFrame;
                              sample: number;
                          }
                      ) => {
                          const computedStats = getComputedStats(
                              container.name,
                              container.type,
                              stats,
                              timelines,
                              sample,
                              true
                          );
                          return acc.concat(...computedStats);
                      },
                      []
                  )
                : [];

            const containerStats = dockerContainerStats.concat(kubernetesContainerStats);
            allContainersStats[index].computedStats = containerStats;

            return acc.concat(...containerStats);
        },
        []
    );
};

module.exports = { getStandardError, getComputedStats, getScenarioConsumption, getStats };
export { getStandardError, getComputedStats, getScenarioConsumption, getStats };
