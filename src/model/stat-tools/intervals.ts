import type { TimeFrame } from '../../types';

// Intersection of two intervals [aStart,aEnd] and [bStart,bEnd]
// Note that we use named-tuples here!
export const intersection = (
    a: [start: number, end: number],
    b: [start: number, end: number]
): [start: number, end: number] | undefined => {
    const [aStart, aEnd] = a;
    const [bStart, bEnd] = b;
    if (bStart > aEnd || aStart > bEnd) {
        return undefined;
    }

    return [Math.max(aStart, bStart), Math.min(aEnd, bEnd)];
};

// Returns the last timeframe (from timeframes) which intersects [prereadTime,readTime]
export const getTimeframe = (
    readTime: number,
    prereadTime: number,
    timeframes: TimeFrame[]
): TimeFrame | undefined =>
    [...timeframes]
        .reverse()
        .find(
            (timeframe) =>
                intersection(
                    [timeframe.start.getTime(), timeframe.end.getTime()],
                    [prereadTime, readTime]
                ) !== undefined
        );
