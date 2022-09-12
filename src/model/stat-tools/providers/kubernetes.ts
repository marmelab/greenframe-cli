import type {
    CadvisorContainerStats,
    GenericStat,
    IoServiceByte,
    Provider,
} from '../../../types';

const computeGenericStats = (stats: CadvisorContainerStats[]): GenericStat[] => {
    const result: GenericStat[] = [];
    if (stats.length === 0) {
        return result;
    }

    let computed: GenericStat = {
        date: new Date(stats[0].stats[0].timestamp),
        cpu: {
            availableSystemCpuUsage: 0,
            currentUsageInUserMode: 0,
            currentUsageInKernelMode: 0,
        },
        io: { currentBytes: 0 },
        network: {
            currentReceived: 0,
            currentTransmitted: 0,
        },
        memory: { usage: 0 },
    };

    for (const [i, stat] of stats.entries()) {
        if (i > 0) {
            computed = computeGenericStat(computed, stats[i - 1], stat);
        }

        result.push(computed);
    }

    return result;
};

export const kubernetes: Provider<CadvisorContainerStats> = {
    computeGenericStats,
};

const computeGenericStat = (
    previousComputed: GenericStat,
    rawPreviousStat: CadvisorContainerStats,
    rawStat: CadvisorContainerStats
): GenericStat => {
    const previousStat = rawPreviousStat.stats[rawPreviousStat.stats.length - 1];
    const stat = rawStat.stats[rawStat.stats.length - 1];
    const cpuCores = rawStat.spec.cpu.limit;
    // the energy consumption of a chip corresponds to its number of builtin cpu
    const toSeconds = (cpu_time: number) => cpu_time / (cpuCores * 1_000_000_000); // Normalize to 1 cpu

    const date = new Date(stat.timestamp);

    const computeCurrentDelta = (previousStatValue: number, newStatValue: number) =>
        newStatValue !== 0 ? Math.abs(newStatValue - previousStatValue) : 0;

    const currentUsageInUserMode = toSeconds(
        computeCurrentDelta(previousStat.cpu.usage.user, stat.cpu.usage.user)
    );

    const currentUsageInKernelMode = toSeconds(
        computeCurrentDelta(previousStat.cpu.usage.system, stat.cpu.usage.system)
    );

    const currentReceived = computeCurrentDelta(
        previousStat.network.rx_bytes,
        stat.network.rx_bytes
    );

    const currentTransmitted = computeCurrentDelta(
        previousStat.network.tx_bytes,
        stat.network.tx_bytes
    );

    const currentBytes = computeCurrentDelta(
        kubernetesSumBlkioStats(previousStat.diskio.io_service_bytes),
        kubernetesSumBlkioStats(stat.diskio.io_service_bytes)
    );

    const availableSystemCpuUsage = toSeconds(
        computeCurrentDelta(previousStat.cpu.usage.system, stat.cpu.usage.system)
    );

    const usage = Math.max(previousComputed.memory.usage, stat.memory.usage);

    const computed = {
        date,
        cpu: {
            availableSystemCpuUsage,
            currentUsageInUserMode,
            currentUsageInKernelMode,
        },
        io: { currentBytes },
        network: { currentReceived, currentTransmitted },
        memory: { usage },
    };

    return computed;
};

// exported for tests
export const kubernetesSumBlkioStats = (blkioStats: IoServiceByte[] = []): number => {
    const blkioStatsByMajorAndMinor = new Map<string, number>([]);

    for (const blkioStat of blkioStats) {
        blkioStatsByMajorAndMinor.set(
            [blkioStat.major, blkioStat.minor].toString(),
            blkioStat.stats.Total
        );
    }

    return [...blkioStatsByMajorAndMinor.values()].reduce(
        (previousValue, currentValue) => {
            return previousValue + currentValue;
        },
        0
    );
};
