import { CONTAINER_TYPES } from './constants';

export type ValueOf<T> = T[keyof T];
export type SubObjects<T> = {
    [key in keyof T]: T[key] extends Record<string | number | symbol, unknown>
        ? SubObjects<T[key]>
        : T[key];
};

export type Analysis = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scenarios: any[];
    baseURL: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    samples: any[];
    useAdblock: boolean;
    ignoreHTTPSErrors: boolean;
    locale: string;
    timezoneId: string;
    projectName: string;
    gitInfos: {
        branchName: string;
        commitMessage: string;
        commitId: string;
        defaultBranchCommitReference: string;
    };
};

export type Meta = {
    container: string;
    type: ValueOf<typeof CONTAINER_TYPES>;
    sample: number;
};

export type TimeFrame = {
    start: Date;
    end: Date;
    title: string;
};

export type TimeFrameWithMeta = TimeFrame & { meta: Meta };

export type IntervalJSON = {
    started: string;
    ended: string;
    elapsed: string;
    title: string;
};

export type Provider<S> = {
    computeGenericStats: (stats: S[]) => GenericStat[];
};

/*
 * given a chronologically ordered list of GenericStat
 * an entry of index i gives statistics about the period between entry[i-1] and entry[i]
 * entry[0] contains no information: fields are null except date
 * entry[1] contains cpu, io, network and memory usage between entry[0].date and entry[1].date
 */
export type GenericStat = {
    date: Date;
    cpu: {
        availableSystemCpuUsage: number; // in seconds (corresponds to entry[i].date - entry[i-1].date)
        currentUsageInUserMode: number;
        currentUsageInKernelMode: number;
    };
    io: {
        currentBytes: number; // disk inputs and outputs in bytes
    };
    network: {
        currentReceived: number; // network inputs in bytes
        currentTransmitted: number; // network outputs in bytes
    };
    memory: { usage: number }; // max of memory usage in bytes
};
export type GenericStatJSON = Omit<GenericStat, 'date'> & { date: string };

export type Milestone = {
    title: string;
    time: number;
};

export type ComputedStat = {
    date: Date;
    time: number; // elapsed time since start of container in s
    userTime: number; // elapsed time during active timeframe, in s
    active: boolean;
    timeframe: TimeFrame | undefined; // undefined when stat is not active
    cpu: {
        availableSystemCpuUsage: number; // computed by model but not yet used
        cpuPercentage: number; // computed by model but not yet used
        totalUsageInUserMode: number;
        totalUsageInKernelMode: number;
        currentUsageInUserMode: number;
        currentUsageInKernelMode: number;
    };
    io: {
        currentBytes: number;
        totalBytes: number;
    };
    network: {
        currentReceived: number;
        currentTransmitted: number;
        totalReceived: number;
        totalTransmitted: number;
    };
    memory: { usage: number };
};

export type ComputedStatWithMeta = ComputedStat & { meta: Meta };

/*
 * Computed Energy Metrics
 */
export type MetricsContainer = {
    s: {
        cpu: number;
        screen: number;
        totalTime: number;
    };
    gb: {
        mem: number;
        disk: number;
        network: number;
    };
    wh: {
        cpu: number;
        mem: number;
        disk: number;
        network: number;
        screen: number;
        total: number;
    };
    co2: {
        cpu: number;
        mem: number;
        disk: number;
        network: number;
        screen: number;
        total: number;
    };
};

export type MetricsPerContainer = Record<string, MetricsContainer>;
export type WhPerTimeFrame = MetricsPerContainer;

export type WhPerRevision = Record<string, MetricsPerContainer>;

export type WhSummary = {
    total: number;
    server: number;
    network: number;
    device: number;
};

export type WhSummaryPercent = {
    serverPercent: number;
    networkPercent: number;
    devicePercent: number;
};

export type EnergyProfile = {
    CPU: number;
    MEM: number;
    DISK: number;
    NETWORK: number;
    PUE: number;
    SCREEN: number;
};
export type EnergyProfileKeys = keyof EnergyProfile;

/*
 * From Docker
 */
// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L172-L181
export type DockerStatsJSON = Stats & {
    name: string;
    id: string;
    networks: Record<string, NetworkStats>;
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L117-L141
type NetworkStats = {
    rx_bytes: number;
    rx_packets: number;
    rx_errors: number;
    rx_dropped: number;
    tx_bytes: number;
    tx_packets: number;
    tx_errors: number;
    tx_dropped: number;
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L153-L170
type Stats = {
    // Common stats
    read: string;
    preread: string;

    // Linux specific stats, not populated on Windows.
    pids_stats: PidsStats;
    blkio_stats: BlkioStats;

    // Windows specific stats, not populated on Linux.
    // NumProcs     uint32       `json:"num_procs"`
    num_procs?: number;
    // StorageStats StorageStats `json:"storage_stats,omitempty"`

    // Shared stats

    cpu_stats: CPUStats;
    precpu_stats: CPUStats;
    memory_stats: MemoryStats;
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L143-L150
type PidsStats = {
    current: number;
    limit?: number;
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L93-L107
type BlkioStats = {
    io_service_bytes_recursive: BlkioStatEntry[];
    io_serviced_recursive: BlkioStatEntry[];
    io_queue_recursive: BlkioStatEntry[];
    io_service_time_recursive: BlkioStatEntry[];
    io_wait_time_recursive: BlkioStatEntry[];
    io_merged_recursive: BlkioStatEntry[];
    io_time_recursive: BlkioStatEntry[];
    sectors_recursive: BlkioStatEntry[];
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L84-L91
export type BlkioStatEntry = {
    major: number;
    minor: number;
    op: string;
    value: number;
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L42-L55
type CPUStats = {
    cpu_usage: CPUUsage;
    system_cpu_usage: number;
    online_cpus: number;
    throttling_data: ThrottlingData;
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L57-L82
type MemoryStats = {
    usage: number;
    max_usage: number;
    stats: Record<string, number>;
    failcnt: number;
    limit: number;
};

// https://github.com/moby/moby/blob/c1d090fcc88fa3bc5b804aead91ec60e30207538/api/types/stats.go#L18-L40
type CPUUsage = {
    // Total CPU time consumed.
    // Units: nanoseconds (Linux)
    // Units: 100's of nanoseconds (Windows)
    total_usage: number;

    // Total CPU time consumed per core (Linux). Not used on Windows.
    // Units: nanoseconds.
    percpu_usage: number[];

    // Time spent by tasks of the cgroup in kernel mode (Linux).
    // Time spent by all container processes in kernel mode (Windows).
    // Units: nanoseconds (Linux).
    // Units: 100's of nanoseconds (Windows). Not populated for Hyper-V Containers.
    usage_in_kernelmode: number;

    // Time spent by tasks of the cgroup in user mode (Linux).
    // Time spent by all container processes in user mode (Windows).
    // Units: nanoseconds (Linux).
    // Units: 100's of nanoseconds (Windows). Not populated for Hyper-V Containers
    usage_in_usermode: number;
};

// ThrottlingData stores CPU throttling stats of one running container.
// Not used on Windows.
type ThrottlingData = {
    /** Number of periods with throttling active */
    periods: number;
    /** Number of periods when the container hits its throttling limit. */
    throttled_periods: number;
    /** Aggregate time the container was throttled for in nanoseconds. */
    throttled_time: number;
};

export type KubernetesStats = {
    read: string;
    memory: number;
    userCpu: number;
    systemCpu: number;
    cpuCores: number;
    networkRx: number;
    networkTx: number;
    blkio: BlkioStatEntry[];
};
export interface CadvisorContainerStats {
    id: string;
    name: string;
    aliases: string[];
    subcontainers?: { name: string }[];
    namespace: string;
    spec: Spec;
    stats: Stat[];
}

export interface Spec {
    creation_time: string;
    labels: Labels;
    envs: Envs;
    has_cpu: boolean;
    cpu: SpecCPU;
    has_memory: boolean;
    memory: SpecMemory;
    has_hugetlb: boolean;
    has_network: boolean;
    has_processes: boolean;
    processes: SpecProcesses;
    has_filesystem: boolean;
    has_diskio: boolean;
    has_custom_metrics: boolean;
    image: string;
}

export interface SpecCPU {
    limit: number;
    max_limit: number;
    mask: string;
    period: number;
}

export interface Envs {
    PATH: string;
}

export interface Labels {
    app: string;
    [key: string]: string;
}

export interface SpecMemory {
    limit: number;
    reservation: number;
    swap_limit: number;
}

export interface SpecProcesses {
    limit: number;
}

export interface Stat {
    timestamp: string;
    cpu: StatCPU;
    diskio: Diskio;
    memory: StatMemory;
    network: Network;
    task_stats: TaskStats;
    processes: StatProcesses;
    resctrl: Diskio;
    cpuset: Cpuset;
}

export interface StatCPU {
    usage: Usage;
    cfs: Cfs;
    schedstat: Schedstat;
    load_average: number;
}

export interface Cfs {
    periods: number;
    throttled_periods: number;
    throttled_time: number;
}

export interface Schedstat {
    run_time: number;
    runqueue_time: number;
    run_periods: number;
}

export interface Usage {
    total: number;
    user: number;
    system: number;
}

export interface Cpuset {
    memory_migrate: number;
}

export interface StatMemory {
    usage: number;
    max_usage: number;
    cache: number;
    rss: number;
    swap: number;
    mapped_file: number;
    working_set: number;
    failcnt: number;
    container_data: Data;
    hierarchical_data: Data;
}

export interface Data {
    pgfault: number;
    pgmajfault: number;
    numa_stats: Diskio;
}

export interface Network {
    name: string;
    rx_bytes: number;
    rx_packets: number;
    rx_errors: number;
    rx_dropped: number;
    tx_bytes: number;
    tx_packets: number;
    tx_errors: number;
    tx_dropped: number;
    interfaces: Interface[];
    tcp: { [key: string]: number };
    tcp6: { [key: string]: number };
    udp: UDP;
    udp6: UDP;
    tcp_advanced: { [key: string]: number };
}

export interface Interface {
    name: string;
    rx_bytes: number;
    rx_packets: number;
    rx_errors: number;
    rx_dropped: number;
    tx_bytes: number;
    tx_packets: number;
    tx_errors: number;
    tx_dropped: number;
}

export interface UDP {
    Listen: number;
    Dropped: number;
    RxQueued: number;
    TxQueued: number;
}

export interface StatProcesses {
    process_count: number;
    fd_count: number;
    socket_count: number;
}

export interface TaskStats {
    nr_sleeping: number;
    nr_running: number;
    nr_stopped: number;
    nr_uninterruptible: number;
    nr_io_wait: number;
}
export interface DiskIoStats {
    Async: number;
    Discard: number;
    Read: number;
    Sync: number;
    Total: number;
    Write: number;
}

export interface IoServiceByte {
    device: string;
    major: number;
    minor: number;
    stats: DiskIoStats;
}

export interface Diskio {
    io_service_bytes: IoServiceByte[];
}
