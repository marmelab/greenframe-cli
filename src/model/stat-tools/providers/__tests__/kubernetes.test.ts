import type { CadvisorContainerStats } from '../../../../types';
import { kubernetes } from '../kubernetes';

test('computeGenericStats', () => {
    const stats: CadvisorContainerStats[] = [
        {
            id: '',
            name: '',
            aliases: [],
            namespace: '',
            spec: {
                labels: {
                    app: 'test',
                },
                envs: {
                    PATH: '/a/test/path',
                },
                image: 'test/image',
                creation_time: '2022-07-18T11:50:01.250790034Z',
                has_cpu: true,
                cpu: {
                    limit: 4,
                    max_limit: 0,
                    mask: '0-11',
                    period: 100_000,
                },
                has_memory: true,
                memory: {
                    limit: 9_223_372_036_854_771_712,
                    reservation: 9_223_372_036_854_771_712,
                    swap_limit: 9_223_372_036_854_771_712,
                },
                has_hugetlb: true,
                has_network: false,
                has_processes: true,
                processes: {
                    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                    limit: 18_446_744_073_709_551_615,
                },
                has_filesystem: false,
                has_diskio: true,
                has_custom_metrics: false,
            },
            stats: [
                {
                    timestamp: '2020-11-04T10:07:40.940136714Z',
                    cpu: {
                        usage: {
                            total: 1_001_461_071,
                            user: 690_000_000,
                            system: 250_000_000,
                        },
                        cfs: {
                            periods: 0,
                            throttled_periods: 0,
                            throttled_time: 0,
                        },
                        schedstat: {
                            run_time: 0,
                            runqueue_time: 0,
                            run_periods: 0,
                        },
                        load_average: 0,
                    },
                    diskio: {
                        io_service_bytes: [
                            {
                                device: '/dev/nvme0n1',
                                major: 254,
                                minor: 0,
                                stats: {
                                    Async: 0,
                                    Discard: 0,
                                    Read: 22_233_088,
                                    Sync: 22_233_088,
                                    Total: 22_233_088,
                                    Write: 0,
                                },
                            },
                        ],
                    },
                    memory: {
                        usage: 90_443_776,
                        max_usage: 12_189_696,
                        cache: 7_856_128,
                        rss: 1_552_384,
                        swap: 0,
                        mapped_file: 4_886_528,
                        working_set: 5_799_936,
                        failcnt: 0,
                        container_data: {
                            pgfault: 0,
                            pgmajfault: 0,
                            numa_stats: {
                                io_service_bytes: [],
                            },
                        },
                        hierarchical_data: {
                            pgfault: 0,
                            pgmajfault: 0,
                            numa_stats: {
                                io_service_bytes: [],
                            },
                        },
                    },
                    network: {
                        name: '',
                        rx_bytes: 778,
                        rx_packets: 0,
                        rx_errors: 0,
                        rx_dropped: 0,
                        tx_bytes: 0,
                        tx_packets: 0,
                        tx_errors: 0,
                        tx_dropped: 0,
                        interfaces: [],
                        tcp: {},
                        tcp6: {},
                        udp: {
                            Listen: 0,
                            Dropped: 0,
                            RxQueued: 0,
                            TxQueued: 0,
                        },
                        udp6: {
                            Listen: 0,
                            Dropped: 0,
                            RxQueued: 0,
                            TxQueued: 0,
                        },
                        tcp_advanced: {},
                    },
                    task_stats: {
                        nr_io_wait: 0,
                        nr_running: 0,
                        nr_sleeping: 0,
                        nr_stopped: 0,
                        nr_uninterruptible: 0,
                    },
                    processes: {
                        fd_count: 0,
                        process_count: 0,
                        socket_count: 0,
                    },
                    resctrl: {
                        io_service_bytes: [],
                    },
                    cpuset: {
                        memory_migrate: 0,
                    },
                },
            ],
        },
        {
            id: '',
            name: '',
            aliases: [],
            namespace: '',
            spec: {
                labels: {
                    app: 'test',
                },
                envs: {
                    PATH: '/a/test/path',
                },
                image: 'test/image',
                creation_time: '2022-07-18T11:50:01.250Z',
                has_cpu: true,
                cpu: {
                    limit: 4,
                    max_limit: 0,
                    mask: '0-11',
                    period: 100_000,
                },
                has_memory: true,
                memory: {
                    limit: 9_223_372_036_854_771_712,
                    reservation: 9_223_372_036_854_771_712,
                    swap_limit: 9_223_372_036_854_771_712,
                },
                has_hugetlb: true,
                has_network: false,
                has_processes: true,
                processes: {
                    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                    limit: 18_446_744_073_709_551_615,
                },
                has_filesystem: false,
                has_diskio: true,
                has_custom_metrics: false,
            },
            stats: [
                {
                    timestamp: '2020-11-04T10:07:41.965Z',
                    cpu: {
                        usage: {
                            total: 1_291_005_241,
                            user: 900_000_000,
                            system: 330_000_000,
                        },
                        cfs: {
                            periods: 0,
                            throttled_periods: 0,
                            throttled_time: 0,
                        },
                        schedstat: {
                            run_time: 0,
                            runqueue_time: 0,
                            run_periods: 0,
                        },
                        load_average: 0,
                    },
                    diskio: {
                        io_service_bytes: [
                            {
                                device: '/dev/nvme0n1',
                                major: 254,
                                minor: 0,
                                stats: {
                                    Async: 0,
                                    Discard: 0,
                                    Read: 22_536_192,
                                    Sync: 22_536_192,
                                    Total: 22_536_192,
                                    Write: 0,
                                },
                            },
                        ],
                    },
                    memory: {
                        usage: 101_158_912,
                        max_usage: 12_189_696,
                        cache: 7_856_128,
                        rss: 1_552_384,
                        swap: 0,
                        mapped_file: 4_886_528,
                        working_set: 5_799_936,
                        failcnt: 0,
                        container_data: {
                            pgfault: 0,
                            pgmajfault: 0,
                            numa_stats: {
                                io_service_bytes: [],
                            },
                        },
                        hierarchical_data: {
                            pgfault: 0,
                            pgmajfault: 0,
                            numa_stats: {
                                io_service_bytes: [],
                            },
                        },
                    },
                    network: {
                        name: '',
                        rx_bytes: 0,
                        rx_packets: 0,
                        rx_errors: 0,
                        rx_dropped: 0,
                        tx_bytes: 0,
                        tx_packets: 0,
                        tx_errors: 0,
                        tx_dropped: 0,
                        interfaces: [],
                        tcp: {},
                        tcp6: {},
                        udp: {
                            Listen: 0,
                            Dropped: 0,
                            RxQueued: 0,
                            TxQueued: 0,
                        },
                        udp6: {
                            Listen: 0,
                            Dropped: 0,
                            RxQueued: 0,
                            TxQueued: 0,
                        },
                        tcp_advanced: {},
                    },
                    task_stats: {
                        nr_io_wait: 0,
                        nr_running: 0,
                        nr_sleeping: 0,
                        nr_stopped: 0,
                        nr_uninterruptible: 0,
                    },
                    processes: {
                        fd_count: 0,
                        process_count: 0,
                        socket_count: 0,
                    },
                    resctrl: {
                        io_service_bytes: [],
                    },
                    cpuset: {
                        memory_migrate: 0,
                    },
                },
            ],
        },
    ];
    const res = kubernetes.computeGenericStats(stats);

    expect(res).toHaveLength(2);

    expect(res).toEqual([
        {
            date: new Date('2020-11-04T10:07:40.940Z'),
            cpu: {
                availableSystemCpuUsage: 0,
                currentUsageInKernelMode: 0,
                currentUsageInUserMode: 0,
            },
            io: {
                currentBytes: 0,
            },
            memory: {
                usage: 0,
            },
            network: {
                currentReceived: 0,
                currentTransmitted: 0,
            },
        },
        {
            date: new Date('2020-11-04T10:07:41.965Z'),
            cpu: {
                availableSystemCpuUsage: 0.02,
                currentUsageInKernelMode: 0.02,
                currentUsageInUserMode: 0.0525,
            },
            io: {
                currentBytes: 303_104,
            },
            network: {
                currentReceived: 0,
                currentTransmitted: 0,
            },
            memory: { usage: 101_158_912 },
        },
    ]);
});
