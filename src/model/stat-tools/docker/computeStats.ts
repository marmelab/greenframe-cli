import type {
    ComputedStat,
    GenericStat,
    TimeFrame,
    Meta,
    ComputedStatWithMeta,
} from '../../../types';

import { getTimeframe, intersection } from '../intervals';

const computeStat = (
    previousComputed: ComputedStat,
    previousStat: GenericStat,
    stat: GenericStat,
    timeframes: TimeFrame[]
): ComputedStat => {
    const date = stat.date;
    const readTime = stat.date.getTime();
    const prereadTime = previousStat.date.getTime();

    const timeframe = getTimeframe(readTime, prereadTime, timeframes);
    const active = timeframe !== undefined;
    const intersectionInterval = timeframe
        ? intersection(
              [timeframe.start.getTime(), timeframe.end.getTime()],
              [prereadTime, readTime]
          )
        : undefined;

    const statDuration = Math.abs(prereadTime - readTime) / 1000; // In s
    const activeDuration = intersectionInterval
        ? Math.abs(intersectionInterval[1] - intersectionInterval[0]) / 1000
        : 0; // Elapsed time for active intervals only

    const time = previousComputed.time + statDuration; // Elapsed time in seconds since beginning
    const userTime = previousComputed.userTime + activeDuration;

    const ratio = activeDuration / statDuration;
    // Over-approximation which ensures that we do not skip any important activity peak
    // This is why we do not apply ratio factor
    const applyActive = (duration: number) => (active ? duration : 0);

    // Current activity normalized per second
    const applyRatio = (duration: number) =>
        activeDuration > 0 ? (1 / activeDuration) * ratio * duration : 0;

    const currentUsageInUserMode = applyRatio(stat.cpu.currentUsageInUserMode);
    const currentUsageInKernelMode = applyRatio(stat.cpu.currentUsageInKernelMode);
    const availableSystemCpuUsage = applyRatio(stat.cpu.availableSystemCpuUsage);
    const currentBytes = applyRatio(stat.io.currentBytes);
    const currentReceived = applyRatio(stat.network.currentReceived);
    const currentTransmitted = applyRatio(stat.network.currentTransmitted);

    // Time spent by tasks of the cgroup in user mode.
    const totalUsageInUserMode =
        previousComputed.cpu.totalUsageInUserMode +
        applyActive(stat.cpu.currentUsageInUserMode);

    // Time spent by tasks of the cgroup in kernel mode.
    const totalUsageInKernelMode =
        previousComputed.cpu.totalUsageInKernelMode +
        applyActive(stat.cpu.currentUsageInKernelMode);

    const cpuPercentage = (currentUsageInUserMode / availableSystemCpuUsage) * 100; // From 0 to 100%

    const totalBytes = previousComputed.io.totalBytes + applyActive(stat.io.currentBytes);

    const totalReceived =
        previousComputed.network.totalReceived +
        applyActive(stat.network.currentReceived);
    const totalTransmitted =
        previousComputed.network.totalTransmitted +
        applyActive(stat.network.currentTransmitted);

    const usage = Math.max(previousComputed.memory.usage, applyActive(stat.memory.usage));

    const computed = {
        date,
        time,
        userTime,
        active,
        ratio,
        timeframe,
        cpu: {
            availableSystemCpuUsage,
            cpuPercentage,
            totalUsageInUserMode,
            totalUsageInKernelMode,
            currentUsageInUserMode,
            currentUsageInKernelMode,
        },
        io: { currentBytes, totalBytes },
        network: { currentReceived, currentTransmitted, totalReceived, totalTransmitted },
        memory: { usage },
    };

    return computed;
};

export const computeStats = ({
    stats,
    timeframes,
    meta,
}: {
    stats: GenericStat[];
    timeframes: TimeFrame[];
    meta: Meta;
}): ComputedStatWithMeta[] => {
    const result: ComputedStatWithMeta[] = [];
    if (stats.length === 0) {
        return result;
    }

    let computed: ComputedStat = {
        date: stats[0].date,
        time: 0,
        userTime: 0,
        active: false,
        timeframe: undefined,
        cpu: {
            availableSystemCpuUsage: 0,
            cpuPercentage: 0,
            totalUsageInUserMode: 0,
            totalUsageInKernelMode: 0,
            currentUsageInUserMode: 0,
            currentUsageInKernelMode: 0,
        },
        io: { currentBytes: 0, totalBytes: 0 },
        network: {
            currentReceived: 0,
            currentTransmitted: 0,
            totalReceived: 0,
            totalTransmitted: 0,
        },
        memory: { usage: 0 },
    };

    for (const [i, stat] of stats.entries()) {
        if (i === 0) {
            continue; // Skip first entry
        }

        computed = computeStat(computed, stats[i - 1], stat, timeframes);
        result.push({
            meta,
            ...computed,
        });
    }

    return result;
};
