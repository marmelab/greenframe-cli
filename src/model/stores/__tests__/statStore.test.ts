import { createStatStore, getComputedStat, getContainers } from '../statStore';
import type { StatStore } from '../statStore';
import { ComputedStatWithMeta } from '../../../types';
import { CONTAINER_TYPES } from '../../../constants';

const generator: Array<[number, number, string, number]> = [
    [0, 0, '00Z', 1e3],
    [0, 0, '01Z', 2e3],
    [0, 0, '02Z', 3e3],
    [0, 1, '00Z', 1e4],
    [0, 1, '01Z', 2e4],
    [0, 1, '02Z', 3e4],
    [1, 0, '00Z', 1e5],
    [1, 0, '01Z', 2e5],
    [1, 0, '02Z', 3e5],
    [1, 1, '00Z', 1e6],
    [1, 1, '01Z', 2e6],
    [1, 1, '02Z', 3e6],
];

const stats: ComputedStatWithMeta[] = generator.map(([s, c, readend, value]) => ({
    meta: {
        sample: s,
        container: `c${c}`,
        type: CONTAINER_TYPES.SERVER,
    },
    date: new Date(`2020-01-01T00:00:${readend}`),
    time: value,
    userTime: value,
    active: false,
    timeframe: undefined,
    cpu: {
        availableSystemCpuUsage: 0,
        cpuPercentage: 0,
        currentUsageInKernelMode: 0,
        currentUsageInUserMode: 0,
        totalUsageInKernelMode: 0,
        totalUsageInUserMode: value,
    },
    io: {
        currentBytes: value,
        totalBytes: value,
    },
    network: {
        currentReceived: value,
        currentTransmitted: value,
        totalReceived: value,
        totalTransmitted: value,
    },
    memory: { usage: value },
}));

let store: StatStore;
beforeEach(() => {
    stats.sort(() => {
        return Math.random() - 0.5;
    });

    store = createStatStore(stats);
});

type ComputedStatsProfile = [Parameters<typeof getComputedStat>[1], number | undefined];
test.each<ComputedStatsProfile>([
    [{ sample: 0, container: 'c0', type: CONTAINER_TYPES.SERVER }, 3e3 - 1e3],
    [{ sample: 0, container: 'c1', type: CONTAINER_TYPES.SERVER }, 3e4 - 1e4],
    [{ sample: 1, container: 'c0', type: CONTAINER_TYPES.SERVER }, 3e5 - 1e5],
    [{ sample: 1, container: 'c1', type: CONTAINER_TYPES.SERVER }, 3e6 - 1e6],
])('getCpuUsage %#', (meta, cpuUsageInUsermode) => {
    expect(getComputedStat(store, meta)?.cpuUsage).toEqual(cpuUsageInUsermode);
});

test.each<ComputedStatsProfile>([
    [{ sample: 0, container: 'c0', type: CONTAINER_TYPES.SERVER }, 3e3 - 1e3],
    [{ sample: 0, container: 'c1', type: CONTAINER_TYPES.SERVER }, 3e4 - 1e4],
    [{ sample: 1, container: 'c0', type: CONTAINER_TYPES.SERVER }, 3e5 - 1e5],
    [{ sample: 1, container: 'c1', type: CONTAINER_TYPES.SERVER }, 3e6 - 1e6],
])('getUserTime %#', (meta, systemCpuUsage) => {
    expect(getComputedStat(store, meta)?.userTime).toEqual(systemCpuUsage);
});

test.each<ComputedStatsProfile>([
    [{ container: 'c0', sample: 0, type: CONTAINER_TYPES.SERVER }, 3e3 / 1e9],
    [{ container: 'c1', sample: 0, type: CONTAINER_TYPES.SERVER }, 3e4 / 1e9],
    [{ container: 'c0', sample: 1, type: CONTAINER_TYPES.SERVER }, 3e5 / 1e9],
    [{ container: 'c1', sample: 1, type: CONTAINER_TYPES.SERVER }, 3e6 / 1e9],
])('getMem %#', (meta, result) => {
    expect(getComputedStat(store, meta)?.memoryUsage).toEqual(result);
});

it.todo('getNetwork');

it.todo('getDisk');

test.each<ComputedStatsProfile>([
    [{ sample: 0, container: 'c0', type: CONTAINER_TYPES.SERVER }, 3e3 - 1e3],
    [{ sample: 0, container: 'c1', type: CONTAINER_TYPES.SERVER }, 3e4 - 1e4],
    [{ sample: 1, container: 'c0', type: CONTAINER_TYPES.SERVER }, 3e5 - 1e5],
    [{ sample: 1, container: 'c1', type: CONTAINER_TYPES.SERVER }, 3e6 - 1e6],
])('getTime %#', (meta, systemCpuUsage) => {
    expect(getComputedStat(store, meta)?.time).toEqual(systemCpuUsage);
});

test.each<[ReturnType<typeof getContainers>]>([[['c0', 'c1']]])(
    'getContainers %#',
    (result) => {
        expect(new Set(getContainers(store))).toEqual(new Set(result));
    }
);
