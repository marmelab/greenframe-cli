import type {
    BlkioStatEntry,
    DockerStatsJSON,
    GenericStat,
    Provider,
} from '../../../types';

const computeGenericStats = (stats: DockerStatsJSON[]): GenericStat[] => {
    const result: GenericStat[] = [];
    if (stats.length === 0) {
        return result;
    }

    let computed: GenericStat = {
        date: new Date(stats[0].read),
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

export const docker: Provider<DockerStatsJSON> = {
    computeGenericStats,
};

const computeGenericStat = (
    previousComputed: GenericStat,
    previousStat: DockerStatsJSON,
    stat: DockerStatsJSON
): GenericStat => {
    // the energy consumption of a chip corresponds to its number of builtin cpu
    const toSeconds = (cpu_time: number) =>
        cpu_time / (stat.cpu_stats.online_cpus * 1_000_000_000); // Normalize to 1 cpu

    const date = new Date(stat.read);

    const computeCurrentDelta = (previousStatValue: number, newStatValue: number) =>
        Math.abs(newStatValue - previousStatValue);

    const currentUsageInUserMode = toSeconds(
        computeCurrentDelta(
            stat.precpu_stats.cpu_usage.usage_in_usermode,
            stat.cpu_stats.cpu_usage.usage_in_usermode
        )
    );

    const currentUsageInKernelMode = toSeconds(
        computeCurrentDelta(
            stat.precpu_stats.cpu_usage.usage_in_kernelmode,
            stat.cpu_stats.cpu_usage.usage_in_kernelmode
        )
    );

    const currentReceived = computeCurrentDelta(
        previousStat.networks.eth0.rx_bytes,
        stat.networks.eth0.rx_bytes
    );

    const currentTransmitted = computeCurrentDelta(
        previousStat.networks.eth0.tx_bytes,
        stat.networks.eth0.tx_bytes
    );

    const currentBytes = computeCurrentDelta(
        sumBlkioStats(previousStat.blkio_stats.io_service_bytes_recursive || []),
        sumBlkioStats(stat.blkio_stats.io_service_bytes_recursive || [])
    );

    const availableSystemCpuUsage = toSeconds(
        computeCurrentDelta(
            stat.precpu_stats.system_cpu_usage,
            stat.cpu_stats.system_cpu_usage
        )
    );

    const usage = Math.max(previousComputed.memory.usage, stat.memory_stats.usage);

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
export const sumBlkioStats = (blkioStats: BlkioStatEntry[] = []): number => {
    const blkioStatsByMajorAndMinor = new Map<string, number>([]);

    for (const blkioStat of blkioStats) {
        if (blkioStat.op === 'Total') {
            blkioStatsByMajorAndMinor.set(
                [blkioStat.major, blkioStat.minor].toString(),
                blkioStat.value
            );
        }
    }

    return [...blkioStatsByMajorAndMinor.values()].reduce(
        (previousValue, currentValue) => {
            return previousValue + currentValue;
        },
        0
    );
};
