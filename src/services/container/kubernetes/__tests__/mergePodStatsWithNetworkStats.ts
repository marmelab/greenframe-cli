/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error polyfill
import structuredClone from 'core-js-pure/actual/structured-clone';
import { KubernetesRuns } from '../..';
import { CONTAINER_TYPES } from '../../../../constants';
import { mergePodStatsWithNetworkStats } from '../mergePodStatsWithNetworkStats';
import { Stat } from '../stats';
import { Nodes } from '../structureNodes';

const emptyStat = {
    network: {
        name: 'eth0',
        interfaces: [
            {
                name: 'eth0',
                rx_bytes: 0,
                tx_bytes: 0,
                rx_packets: 0,
                tx_packets: 0,
            },
        ],

        rx_bytes: 0,
        tx_bytes: 0,
        rx_packets: 0,
        tx_packets: 0,
        tcp: {
            active_established: 0,
            active_syn_recv: 0,
        },
    },
} as unknown as Stat;

// networkStats_ID_Iteration
const networkStat_1_1 = {
    network: {
        name: 'eth0',
        interfaces: [
            {
                name: 'eth0',
                rx_bytes: 1000,
                tx_bytes: 1000,
                rx_packets: 300,
                tx_packets: 300,
            },
        ],

        rx_bytes: 1000,
        tx_bytes: 1000,
        rx_packets: 300,
        tx_packets: 300,
        tcp: {
            active_established: 100,
            active_syn_recv: 200,
        },
    },
} as unknown as Stat;

const networkStat_1_2 = {
    network: {
        name: 'eth0',
        interfaces: [
            {
                name: 'eth0',
                rx_bytes: 2000,
                tx_bytes: 2000,
                rx_packets: 600,
                tx_packets: 600,
            },
        ],

        rx_bytes: 2000,
        tx_bytes: 2000,
        rx_packets: 600,
        tx_packets: 600,
        tcp: {
            active_established: 200,
            active_syn_recv: 400,
        },
    },
} as unknown as Stat;

// networkStats_ID_Iteration_NumberOfPods
const networkStat_1_1_2 = {
    network: {
        name: 'eth0',
        interfaces: [
            {
                name: 'eth0',
                rx_bytes: 500,
                tx_bytes: 500,
                rx_packets: 150,
                tx_packets: 150,
            },
        ],

        rx_bytes: 500,
        tx_bytes: 500,
        rx_packets: 150,
        tx_packets: 150,
        tcp: {
            active_established: 50,
            active_syn_recv: 100,
        },
    },
} as unknown as Stat;

const networkStat_1_2_2 = {
    network: {
        name: 'eth0',
        interfaces: [
            {
                name: 'eth0',
                rx_bytes: 1000,
                tx_bytes: 1000,
                rx_packets: 300,
                tx_packets: 300,
            },
        ],

        rx_bytes: 1000,
        tx_bytes: 1000,
        rx_packets: 300,
        tx_packets: 300,
        tcp: {
            active_established: 100,
            active_syn_recv: 200,
        },
    },
} as unknown as Stat;

const networkStat_2_1 = {
    network: {
        name: 'eth0',
        interfaces: [
            {
                name: 'eth0',
                rx_bytes: 10,
                tx_bytes: 10,
                rx_packets: 30,
                tx_packets: 30,
            },
        ],

        rx_bytes: 10,
        tx_bytes: 10,
        rx_packets: 30,
        tx_packets: 30,
        tcp: {
            active_established: 1,
            active_syn_recv: 2,
        },
    },
} as unknown as Stat;

const networkStat_2_2 = {
    network: {
        name: 'eth0',
        interfaces: [
            {
                name: 'eth0',
                rx_bytes: 1000,
                tx_bytes: 1000,
                rx_packets: 300,
                tx_packets: 300,
            },
        ],

        rx_bytes: 1000,
        tx_bytes: 1000,
        rx_packets: 300,
        tx_packets: 300,
        tcp: {
            active_established: 1,
            active_syn_recv: 2,
        },
    },
} as unknown as Stat;

const network1 = {
    name: 'network-1',
    type: CONTAINER_TYPES.SERVER,
    kubernetesStats: [
        {
            sample: 1,
            timelines: [],
            stats: [
                {
                    name: 'network-1',
                    id: 'network-1',
                    aliases: [],
                    namespace: 'default',
                    spec: {} as any,
                    stats: [
                        structuredClone(networkStat_1_1),
                        structuredClone(networkStat_1_2),
                    ],
                },
            ],
        },
        {
            sample: 2,
            timelines: [],
            stats: [
                {
                    name: 'network-1',
                    id: 'network-1',
                    aliases: [],
                    namespace: 'default',
                    spec: {} as any,
                    stats: [
                        structuredClone(networkStat_1_1),
                        structuredClone(networkStat_1_2),
                    ],
                },
            ],
        },
    ],
};

const network2 = {
    name: 'network-2',
    type: CONTAINER_TYPES.SERVER,
    kubernetesStats: [
        {
            sample: 1,
            timelines: [],
            stats: [
                {
                    name: 'network-2',
                    id: 'network-2',
                    aliases: [],
                    namespace: 'default',
                    spec: {} as any,
                    stats: [
                        structuredClone(networkStat_2_1),
                        structuredClone(networkStat_2_2),
                    ],
                },
            ],
        },
        {
            sample: 2,
            timelines: [],
            stats: [
                {
                    name: 'network-1',
                    id: 'network-1',
                    aliases: [],
                    namespace: 'default',
                    spec: {} as any,
                    stats: [
                        structuredClone(networkStat_2_1),
                        structuredClone(networkStat_2_2),
                    ],
                },
            ],
        },
    ],
};

const buildEmptyPod = (name: string) => ({
    name: name,
    type: CONTAINER_TYPES.SERVER,
    kubernetesStats: [
        {
            sample: 1,
            timelines: [],
            stats: [
                {
                    name: name,
                    id: name,
                    aliases: [],
                    namespace: 'default',
                    spec: {} as any,
                    stats: [structuredClone(emptyStat), structuredClone(emptyStat)],
                },
            ],
        },
        {
            sample: 2,
            timelines: [],
            stats: [
                {
                    name: name,
                    id: name,
                    aliases: [],
                    namespace: 'default',
                    spec: {} as any,
                    stats: [structuredClone(emptyStat), structuredClone(emptyStat)],
                },
            ],
        },
    ],
});

describe('mergePodStatsWithNetworkStats', () => {
    it('should merge stats with one pod and one network', () => {
        const nodes: Nodes = {
            'node-1': [
                {
                    greenframeId: 'cadvisor-1',
                    fullName: 'cadvisor-1',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
                {
                    greenframeId: 'network-1',
                    fullName: 'network-1',
                    type: CONTAINER_TYPES.SERVER,
                    container: 'network',
                    linkedContainers: ['pod-1'],
                },
                {
                    greenframeId: 'pod-1',
                    fullName: 'pod-1',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
            ],
        };

        const run: KubernetesRuns = {
            'network-1': structuredClone(network1),
            'pod-1': buildEmptyPod('pod-1'),
        };

        mergePodStatsWithNetworkStats(nodes, run);

        expect(run).toEqual({
            'pod-1': {
                name: 'pod-1',
                type: CONTAINER_TYPES.SERVER,
                kubernetesStats: [
                    {
                        sample: 1,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-1',
                                id: 'pod-1',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1),
                                    structuredClone(networkStat_1_2),
                                ],
                            },
                        ],
                    },
                    {
                        sample: 2,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-1',
                                id: 'pod-1',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1),
                                    structuredClone(networkStat_1_2),
                                ],
                            },
                        ],
                    },
                ],
            },
        });
    });

    it('should merge stats with one pod and one network and another one pod and another one network', () => {
        const nodes: Nodes = {
            'node-1': [
                {
                    greenframeId: 'cadvisor-1',
                    fullName: 'cadvisor-1',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
                {
                    greenframeId: 'network-1',
                    fullName: 'network-1',
                    type: CONTAINER_TYPES.SERVER,
                    container: 'network',
                    linkedContainers: ['pod-1'],
                },
                {
                    greenframeId: 'pod-1',
                    fullName: 'pod-1',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
                {
                    greenframeId: 'pod-2',
                    fullName: 'pod-2',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
                {
                    greenframeId: 'network-2',
                    fullName: 'network-2',
                    type: CONTAINER_TYPES.SERVER,
                    container: 'network',
                    linkedContainers: ['pod-2'],
                },
            ],
        };

        const run: KubernetesRuns = {
            'network-1': structuredClone(network1),
            'pod-1': buildEmptyPod('pod-1'),
            'pod-2': buildEmptyPod('pod-2'),
            'network-2': structuredClone(network2),
        };

        mergePodStatsWithNetworkStats(nodes, run);

        expect(run).toEqual({
            'pod-1': {
                name: 'pod-1',
                type: CONTAINER_TYPES.SERVER,
                kubernetesStats: [
                    {
                        sample: 1,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-1',
                                id: 'pod-1',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1),
                                    structuredClone(networkStat_1_2),
                                ],
                            },
                        ],
                    },
                    {
                        sample: 2,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-1',
                                id: 'pod-1',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1),
                                    structuredClone(networkStat_1_2),
                                ],
                            },
                        ],
                    },
                ],
            },
            'pod-2': {
                name: 'pod-2',
                type: CONTAINER_TYPES.SERVER,
                kubernetesStats: [
                    {
                        sample: 1,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-2',
                                id: 'pod-2',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_2_1),
                                    structuredClone(networkStat_2_2),
                                ],
                            },
                        ],
                    },
                    {
                        sample: 2,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-2',
                                id: 'pod-2',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_2_1),
                                    structuredClone(networkStat_2_2),
                                ],
                            },
                        ],
                    },
                ],
            },
        });
    });

    it('should merge stats with two pods and one network', () => {
        const nodes: Nodes = {
            'node-1': [
                {
                    greenframeId: 'cadvisor-1',
                    fullName: 'cadvisor-1',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
                {
                    greenframeId: 'network-1',
                    fullName: 'network-1',
                    type: CONTAINER_TYPES.SERVER,
                    container: 'network',
                    linkedContainers: ['pod-1', 'pod-2'],
                },
                {
                    greenframeId: 'pod-1',
                    fullName: 'pod-1',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
                {
                    greenframeId: 'pod-2',
                    fullName: 'pod-2',
                    type: CONTAINER_TYPES.SERVER,
                    linkedContainers: [],
                },
            ],
        };
        const run: KubernetesRuns = {
            'network-1': structuredClone(network1),
            'pod-1': buildEmptyPod('pod-1'),
            'pod-2': buildEmptyPod('pod-2'),
        };

        mergePodStatsWithNetworkStats(nodes, run);

        expect(run).toEqual({
            'pod-1': {
                name: 'pod-1',
                type: CONTAINER_TYPES.SERVER,
                kubernetesStats: [
                    {
                        sample: 1,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-1',
                                id: 'pod-1',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1_2),
                                    structuredClone(networkStat_1_2_2),
                                ],
                            },
                        ],
                    },
                    {
                        sample: 2,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-1',
                                id: 'pod-1',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1_2),
                                    structuredClone(networkStat_1_2_2),
                                ],
                            },
                        ],
                    },
                ],
            },
            'pod-2': {
                name: 'pod-2',
                type: CONTAINER_TYPES.SERVER,
                kubernetesStats: [
                    {
                        sample: 1,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-2',
                                id: 'pod-2',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1_2),
                                    structuredClone(networkStat_1_2_2),
                                ],
                            },
                        ],
                    },
                    {
                        sample: 2,
                        timelines: [],
                        stats: [
                            {
                                name: 'pod-2',
                                id: 'pod-2',
                                aliases: [],
                                namespace: 'default',
                                spec: {} as any,
                                stats: [
                                    structuredClone(networkStat_1_1_2),
                                    structuredClone(networkStat_1_2_2),
                                ],
                            },
                        ],
                    },
                ],
            },
        });
    });
});
