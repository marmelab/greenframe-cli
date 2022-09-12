import initDebug from 'debug';
import { CONTAINER_TYPES } from '../../constants';
import type { ValueOf } from '../../types';
import { getContainerStats } from './kubernetes/getContainerStats';
import { CadvisorContainerStats } from './kubernetes/stats';
import { Nodes } from './kubernetes/structureNodes';
const debug = initDebug('greenframe:services:container:getPodsStats');
export type PodStat = {
    podName: string;
    podType: ValueOf<typeof CONTAINER_TYPES>;
    stats: CadvisorContainerStats[];
};

const getPodsStatsWithCadvisor = async (
    nodeStructure: Nodes,
    node: string,
    podsStats: Record<string, PodStat>
) => {
    const [cadvisorPod, ...pods] = nodeStructure[node];
    for (const pod of pods) {
        const podName = pod.greenframeId;
        if (!podsStats[podName]) {
            podsStats[podName] = {
                podName,
                podType: pod.type,
                stats: [],
            };
        }

        debug(`Getting stats for pod ${podName}`);
        const podStats = await getContainerStats(cadvisorPod, pod);
        podsStats[podName].stats.push(podStats);
    }
};

export const getPodsStats = (nodeStructure: Nodes) => {
    debug('Start observing pods stats');
    const stats: Record<string, PodStat> = {};
    // Read first immediately
    for (const node of Object.keys(nodeStructure)) {
        getPodsStatsWithCadvisor(nodeStructure, node, stats);
    }

    const interval = setInterval(() => {
        for (const node of Object.keys(nodeStructure)) {
            getPodsStatsWithCadvisor(nodeStructure, node, stats);
        }
    }, 1000);
    const stop = () => {
        debug('Stop observing pods stats');
        clearInterval(interval);
        return stats;
    };

    return stop;
};
