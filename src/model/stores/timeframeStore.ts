import type { TimeFrameWithMeta } from '../../types';

// map: containerName -> TimeFrameWithMeta[]
export type TimeFrameStore = Map<string, TimeFrameWithMeta[]>;

// add an entry
export const add = (store: TimeFrameStore, value: TimeFrameWithMeta): void => {
    const key = value.meta.container;
    if (store.has(key)) {
        store.get(key)?.push(value);
    } else {
        store.set(key, [value]);
    }
};

export const createTimeFrameStore = (values: TimeFrameWithMeta[]): TimeFrameStore => {
    const store: TimeFrameStore = new Map() as TimeFrameStore;
    for (const value of values) add(store, value);
    return store;
};

// unordered array of unique titles
export const getTitles = (store: TimeFrameStore): string[] => {
    const timeframes = [...store.values()].flat();
    const titleSet = timeframes.reduce((acc: Set<string>, value: TimeFrameWithMeta) => {
        acc.add(value.title);
        return acc;
    }, new Set());
    return [...titleSet];
};
