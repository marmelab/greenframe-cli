import { groupBy } from 'lodash';

export const getAverageStats = (computedStats: any) => {
    // Groupe stats by sample
    const statsBySample = groupBy(computedStats, (computed: any) => computed.meta.sample);

    // Compute the number of entries of the smallest sample
    const minSampleSize = Object.values(statsBySample).reduce(
        (minSize: any, sampleStats: any) => Math.min(minSize, sampleStats.length),
        Number.POSITIVE_INFINITY
    );

    // Resize all samples by trimming bigger samples
    Object.keys(statsBySample).map((sample) => {
        statsBySample[sample].splice(
            minSampleSize,
            statsBySample[sample].length - minSampleSize
        );
    });

    // Initialize average stats
    const initialStat = {
        n: 0,
        date: new Date(),
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
        io: {
            currentBytes: 0,
            totalBytes: 0,
        },
        network: {
            currentReceived: 0,
            currentTransmitted: 0,
            totalReceived: 0,
            totalTransmitted: 0,
        },
        memory: {
            usage: 0,
        },
    };

    // For each entry, compute timeframe average and metrics average
    const averageStats = [...new Array(minSampleSize).keys()].map((index) =>
        Object.values(statsBySample).reduce(
            (average: any, entries: any) =>
                incrementalAverageStats(average, entries[index]),
            initialStat
        )
    );

    return averageStats;
};

export const addAvg = (value: any, average: any, n: any) =>
    ((Number.isNaN(value) ? 0 : value) + n * average) / (n + 1);

export const incrementalAverageStats = (average: any, entry: any) => {
    const n = average.n;
    const date = n === 0 ? entry.date : average.date;
    const timeframe = average.timeframe
        ? average.timeframe
        : entry.timeframe
        ? entry.timeframe
        : undefined;

    return {
        n: n + 1,
        date,
        time: addAvg(entry.time, average.time, n),
        userTime: addAvg(entry.userTime, average.userTime, n),
        active: average.active || entry.active,
        timeframe,
        cpu: {
            availableSystemCpuUsage: addAvg(
                entry.cpu.availableSystemCpuUsage,
                average.cpu.availableSystemCpuUsage,
                n
            ),
            cpuPercentage: addAvg(entry.cpu.cpuPercentage, average.cpu.cpuPercentage, n),
            totalUsageInUserMode: addAvg(
                entry.cpu.totalUsageInUserMode,
                average.cpu.totalUsageInUserMode,
                n
            ),
            totalUsageInKernelMode: addAvg(
                entry.cpu.totalUsageInKernelMode,
                average.cpu.totalUsageInKernelMode,
                n
            ),
            currentUsageInUserMode: addAvg(
                entry.cpu.currentUsageInUserMode,
                average.cpu.currentUsageInUserMode,
                n
            ),
            currentUsageInKernelMode: addAvg(
                entry.cpu.currentUsageInKernelMode,
                average.cpu.currentUsageInKernelMode,
                n
            ),
        },
        io: {
            currentBytes: addAvg(entry.io.currentBytes, average.io.currentBytes, n),
            totalBytes: addAvg(entry.io.totalBytes, average.io.totalBytes, n),
        },
        network: {
            currentReceived: addAvg(
                entry.network.currentReceived,
                average.network.currentReceived,
                n
            ),
            currentTransmitted: addAvg(
                entry.network.currentTransmitted,
                average.network.currentTransmitted,
                n
            ),
            totalReceived: addAvg(
                entry.network.totalReceived,
                average.network.totalReceived,
                n
            ),
            totalTransmitted: addAvg(
                entry.network.totalTransmitted,
                average.network.totalTransmitted,
                n
            ),
        },
        memory: {
            usage: addAvg(entry.memory.usage, average.memory.usage, n),
        },
    };
};
