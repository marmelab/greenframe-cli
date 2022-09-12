import { CONTAINER_TYPES } from '../../constants';
import type { Meta, ComputedStatWithMeta, ValueOf } from '../../types';

// map: containerName -> ComputedStatWithMeta[]
export type StatStore = Map<string, Array<ComputedStatWithMeta>>;

export const createStatStore = (values: ComputedStatWithMeta[]): StatStore => {
    const store: StatStore = new Map() as StatStore;
    for (const value of values) add(store, value);
    return store;
};

// add an entry
const add = (store: StatStore, value: ComputedStatWithMeta): void => {
    const key = value.meta.container;
    if (store.has(key)) {
        store.get(key)?.push(value);
    } else {
        store.set(key, [value]);
    }
};

export const getOrderedStatsForContainer = (
    store: StatStore,
    container: string
): ComputedStatWithMeta[] => {
    if (!store.has(container)) {
        return [];
    }

    const stats = store.get(container) as ComputedStatWithMeta[];
    stats.sort((a, b) => a.date.getTime() - b.date.getTime());
    return stats;
};

export const getOrderedStatsForContainerSample = (
    store: StatStore,
    { container, sample, timeFrameTitle }: Meta & { timeFrameTitle?: string }
): ComputedStatWithMeta[] => {
    if (!store.has(container)) {
        return [];
    }

    const statsForContainer = store.get(container) as ComputedStatWithMeta[];
    const filteredStats = statsForContainer.filter(
        (entry) =>
            entry.meta.sample === sample &&
            (timeFrameTitle ? entry.timeframe?.title === timeFrameTitle : true)
    );
    filteredStats.sort((a, b) => a.date.getTime() - b.date.getTime());
    return filteredStats;
};

export const getContainers = (store: StatStore): string[] => [...store.keys()];

export const getContainerType = (
    store: StatStore,
    container: string
): ValueOf<typeof CONTAINER_TYPES> => {
    const orderedStats = getOrderedStatsForContainer(store, container);
    return orderedStats[0].meta.type;
};

export const getSamples = (store: StatStore): number[] => {
    const stats = [...store.values()].flat();
    const samples = stats.reduce((acc: Set<number>, value: ComputedStatWithMeta) => {
        acc.add(value.meta.sample);
        return acc;
    }, new Set());
    return [...samples];
};

export const getComputedStat = (
    store: StatStore,
    { container, sample, type, timeFrameTitle }: Meta & { timeFrameTitle?: string }
):
    | {
          time: number;
          userTime: number;
          cpuUsage: number;
          memoryUsage: number;
          network: number;
          disk: number;
      }
    | undefined => {
    const orderedStats = getOrderedStatsForContainerSample(store, {
        container,
        type,
        sample,
        timeFrameTitle,
    });
    const len = orderedStats.length;
    if (len === 0) {
        return undefined;
    }

    const first = orderedStats[0];
    const last = orderedStats[len - 1];
    return {
        time: last.time - first.time, // In s
        userTime: last.userTime - first.userTime, // In s
        cpuUsage:
            first.cpu.currentUsageInUserMode +
            first.cpu.currentUsageInKernelMode +
            last.cpu.totalUsageInUserMode +
            last.cpu.totalUsageInKernelMode -
            (first.cpu.totalUsageInUserMode + first.cpu.totalUsageInKernelMode), // In s
        memoryUsage: last.memory.usage / 1_000_000_000, // In GB
        network:
            (first.network.currentReceived +
                first.network.currentTransmitted +
                last.network.totalReceived +
                last.network.totalTransmitted -
                (first.network.totalReceived + first.network.totalTransmitted)) /
            1_000_000_000, // In GB
        disk:
            (first.io.currentBytes + (last.io.totalBytes - first.io.totalBytes)) /
            1_000_000_000, // In GB
    };
};
