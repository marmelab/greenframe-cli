import initDebug from 'debug';
import { V1Pod } from '@kubernetes/client-node';
import { getCadvisorPods } from './cadvisor';
import { getPodName, getNodeName, getPodsByLabel } from './pods';
import { CONTAINER_TYPES } from '../../../constants';
import { getContainerStats } from './getContainerStats';
import { ValueOf } from '../../../types';

const debug = initDebug('greenframe:services:container:structureNodes');

export type AugmentedPod = V1Pod & {
    type: ValueOf<typeof CONTAINER_TYPES>;
    fullName: string;
    greenframeId: string; // Identifier for the pod or container in greenframe, must be unique
    container?: string; // Name of the container in the pod
    networkContainerId?: string; // Identifier of the network container in cgroup
    linkedContainers: string[]; // greenframeId of linked containers of the network container
};
export type Nodes = Record<string, AugmentedPod[]>;

export const getNodes = async (
    podsNamespacesAndLabels: string[] = [],
    databaseNamespacesAndLabels: string[] = []
) => {
    debug('Get nodes for pods and databases');
    const nodes = await initNodesWithCadvisorPod();
    const observedNetworkPods = new Map<string, AugmentedPod>();
    const counterInstance = new Map<string, number>();

    await addPodNodes(
        nodes,
        podsNamespacesAndLabels,
        observedNetworkPods,
        counterInstance,
        CONTAINER_TYPES.SERVER
    );
    await addPodNodes(
        nodes,
        databaseNamespacesAndLabels,
        observedNetworkPods,
        counterInstance,
        CONTAINER_TYPES.DATABASE
    );

    // Remove nodes without pods (except cadvisor)
    for (const node of Object.keys(nodes)) {
        nodes[node].length === 1 && delete nodes[node];
    }

    return nodes;
};

export const initNodesWithCadvisorPod = async () => {
    const cadvisorNodes: Nodes = {};
    const cadvisorPods = await getCadvisorPods();
    for (const cadvisorPod of cadvisorPods) {
        const node = getNodeName(cadvisorPod);
        cadvisorNodes[node] = [
            addTypeToPod(
                cadvisorPod,
                CONTAINER_TYPES.SERVER,
                getPodName(cadvisorPod),
                getPodName(cadvisorPod)
            ),
        ];
    }

    return cadvisorNodes;
};

const addTypeToPod = (
    pod: V1Pod,
    type: ValueOf<typeof CONTAINER_TYPES>,
    fullName: string,
    greenframeId: string,
    container?: string,
    networkContainerId?: string
): AugmentedPod => {
    const augmentedPod = {
        type,
        fullName,
        greenframeId,
        container,
        networkContainerId,
        linkedContainers: [],
        ...pod,
    };
    return augmentedPod;
};

const addPodNodes = async (
    nodes: Nodes,
    namespacesAndLabels: string[],
    observedNetworkPods: Map<string, AugmentedPod>,
    counterInstance: Map<string, number>,
    type: ValueOf<typeof CONTAINER_TYPES>
) => {
    for (const namespaceAndLabel of namespacesAndLabels) {
        debug(`Get pods for ${namespaceAndLabel}`);
        const [namespace, rest] = namespaceAndLabel.split(':');
        const [label, container] = rest.split('/');
        const pods = await getPodsByLabel(label, namespace);
        for (const pod of pods) {
            const node = getNodeName(pod);
            if (!nodes[node]) {
                throw new Error(`Cannot find cadvisor instance for node ${node}`);
            }

            const podName = getPodName(pod);

            const instanceNb = counterInstance.get(namespaceAndLabel) ?? 0;
            counterInstance.set(namespaceAndLabel, instanceNb + 1);

            const greenframeId = `${namespaceAndLabel}-${instanceNb}`;

            if (!observedNetworkPods.has(podName)) {
                const networkContainerId = await findNetworkContainer(
                    nodes[node][0],
                    pod
                );
                const augmentedPod = addTypeToPod(
                    pod,
                    type,
                    `${podName}/network`,
                    `${namespace}:${label}/network-${instanceNb}`,
                    'network',
                    networkContainerId
                );
                nodes[node].push(augmentedPod);
                observedNetworkPods.set(podName, augmentedPod);
            }

            const networkContainer = observedNetworkPods.get(podName);
            networkContainer?.linkedContainers.push(greenframeId);
            nodes[node].push(
                addTypeToPod(
                    pod,
                    type,
                    `${podName}${container != null ? `/${container}` : ''}`,
                    greenframeId,
                    container
                )
            );
        }
    }
};

const findNetworkContainer = async (cadvisorPod: AugmentedPod, pod: V1Pod) => {
    const augmentedPod = addTypeToPod(pod, CONTAINER_TYPES.NETWORK, getPodName(pod), '');
    const data = await getContainerStats(cadvisorPod, augmentedPod);
    if (!data.subcontainers) {
        throw new Error(`Cannot find containers for pod ${pod.metadata?.name}`);
    }

    for (const container of data.subcontainers) {
        const containerId = container.name.split('/').slice(-1)[0];
        const augmentedContainerPod = addTypeToPod(
            pod,
            CONTAINER_TYPES.NETWORK,
            `${getPodName(pod)}/${containerId}`,
            '',
            undefined,
            containerId
        );
        const containerData = await getContainerStats(cadvisorPod, augmentedContainerPod);
        if (containerData.spec.image?.includes('k8s.gcr.io/pause')) {
            return containerId;
        }
    }

    throw new Error(`Cannot find network container for pod ${getPodName(pod)}`);
};
