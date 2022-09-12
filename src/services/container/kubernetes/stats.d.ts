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
