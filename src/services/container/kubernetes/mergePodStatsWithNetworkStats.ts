import { KubernetesRuns, kubernetesStats } from '..';
import { SubObjects } from '../../../types';
import { Network } from './stats';
import { Nodes } from './structureNodes';

/**
 * Merge pods stats with the network stats
 * Divide network stats by the number of linked containers
 * Delete the network stats
 * @param nodes
 * @param runs
 */
export const mergePodStatsWithNetworkStats = (nodes: Nodes, runs: KubernetesRuns) => {
    for (const node of Object.keys(nodes)) {
        const [, ...pods] = nodes[node];
        for (const pod of pods) {
            if (pod.container === 'network') {
                const networkdStats = runs[pod.greenframeId].kubernetesStats;
                const numberOfLinkedContainers = pod.linkedContainers.length;
                for (const linkedContainer of pod.linkedContainers) {
                    const lonePodStats = runs[linkedContainer].kubernetesStats;
                    mergeStats(networkdStats, lonePodStats, numberOfLinkedContainers);
                    delete runs[pod.greenframeId];
                }
            }
        }
    }
};

const mergeStats = (
    networkStats: kubernetesStats,
    podStats: kubernetesStats,
    divideStatsBy: number
) => {
    for (const [i, podStat] of podStats.entries()) {
        for (let j = 0; j < podStat.stats.length; j++) {
            for (let k = 0; k < podStat.stats[j].stats.length; k++) {
                mergeNetwork(
                    networkStats[i].stats[j].stats[k].network,
                    podStat.stats[j].stats[k].network,
                    divideStatsBy
                );
            }
        }
    }
};

const mergeNetwork = (network: Network, pod: Network, divideStatsBy: number) => {
    mergeObject(network, pod, divideStatsBy);
};

const mergeObject = <T extends Network | SubObjects<T>>(
    obj: T | SubObjects<T>,
    pod: T | SubObjects<T>,
    divideStatsBy: number
) => {
    for (const key of Object.keys(obj) as Array<keyof T>) {
        if (typeof obj[key] === 'object') {
            if (pod[key] === undefined) {
                pod[key] = {} as T[typeof key];
            }

            mergeObject(obj[key], pod[key], divideStatsBy);
        } else if (Array.isArray(obj[key])) {
            if (pod[key] === undefined) {
                pod[key] = [] as T[typeof key];
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mergeObject(obj[key], pod[key], divideStatsBy);
        } else if (typeof obj[key] === 'number') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pod[key] = Math.floor(obj[key] / divideStatsBy);
        } else {
            pod[key] = obj[key];
        }
    }
};
