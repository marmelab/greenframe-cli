import initDebug from 'debug';
import { getCadvisorMetrics } from './cadvisor';
import { CadvisorContainerStats } from './stats';
import { AugmentedPod } from './structureNodes';

const debug = initDebug('greenframe:services:container:kubernetes:getContainerStats');
export const getContainerStats = async (
    cadvisorPod: AugmentedPod,
    pod: AugmentedPod
): Promise<CadvisorContainerStats> => {
    debug(`Getting stats for kubernetes container ${pod.fullName}`);
    const containerId = pod.networkContainerId
        ? pod.networkContainerId
        : pod.container
        ? pod.status?.containerStatuses
              ?.find((container) => container.name === pod.container)
              ?.containerID?.replace('containerd://', '')
        : '';
    if (containerId == null) {
        throw new Error(`Cannot find container ID for container ${pod.fullName}`);
    }

    const fullContainerId = `/kubepods/${pod.status?.qosClass?.toLocaleLowerCase()}/pod${
        pod.metadata?.uid
    }${containerId !== '' ? `/${containerId}` : ''}`;

    const rawStats = await getCadvisorMetrics(
        cadvisorPod.metadata?.name || 'cadvisor',
        fullContainerId
    );

    rawStats.stats = rawStats.stats.slice(-2);
    return rawStats;
};
