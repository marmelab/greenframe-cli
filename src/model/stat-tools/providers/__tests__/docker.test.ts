import type { DockerStatsJSON } from '../../../../types';
import { docker, sumBlkioStats } from '../docker';

test('computeGenericStats', () => {
    const stats: DockerStatsJSON[] = [
        {
            read: '2020-11-04T10:07:40.940136714Z',
            preread: '0001-01-01T00:00:00Z',
            pids_stats: { current: 19 },
            blkio_stats: {
                io_service_bytes_recursive: [
                    { major: 254, minor: 0, op: 'Read', value: 22_233_088 },
                    { major: 254, minor: 0, op: 'Write', value: 0 },
                    { major: 254, minor: 0, op: 'Sync', value: 22_233_088 },
                    { major: 254, minor: 0, op: 'Async', value: 0 },
                    { major: 254, minor: 0, op: 'Discard', value: 0 },
                    { major: 254, minor: 0, op: 'Total', value: 22_233_088 },
                ],
                io_serviced_recursive: [
                    { major: 254, minor: 0, op: 'Read', value: 601 },
                    { major: 254, minor: 0, op: 'Write', value: 0 },
                    { major: 254, minor: 0, op: 'Sync', value: 601 },
                    { major: 254, minor: 0, op: 'Async', value: 0 },
                    { major: 254, minor: 0, op: 'Discard', value: 0 },
                    { major: 254, minor: 0, op: 'Total', value: 601 },
                ],
                io_queue_recursive: [],
                io_service_time_recursive: [],
                io_wait_time_recursive: [],
                io_merged_recursive: [],
                io_time_recursive: [],
                sectors_recursive: [],
            },
            num_procs: 0,
            // Storage_stats: {},
            cpu_stats: {
                cpu_usage: {
                    total_usage: 1_001_461_071,
                    percpu_usage: [249_727_566, 325_249_064, 175_364_138, 251_120_303],
                    usage_in_kernelmode: 250_000_000,
                    usage_in_usermode: 690_000_000,
                },
                system_cpu_usage: 2_331_680_000_000,
                online_cpus: 4,
                throttling_data: {
                    periods: 0,
                    throttled_periods: 0,
                    throttled_time: 0,
                },
            },
            precpu_stats: {
                cpu_usage: {
                    total_usage: 0,
                    usage_in_kernelmode: 0,
                    usage_in_usermode: 0,
                    percpu_usage: [0, 0, 0, 0],
                },
                system_cpu_usage: 0,
                online_cpus: 4,
                throttling_data: {
                    periods: 0,
                    throttled_periods: 0,
                    throttled_time: 0,
                },
            },
            memory_stats: {
                usage: 90_443_776,
                max_usage: 90_558_464,
                failcnt: 0,
                stats: {
                    active_anon: 61_095_936,
                    active_file: 6_217_728,
                    cache: 24_059_904,
                    dirty: 0,
                    hierarchical_memory_limit: 9_223_372_036_854_771_712,
                    hierarchical_memsw_limit: 9_223_372_036_854_771_712,
                    inactive_anon: 0,
                    inactive_file: 17_571_840,
                    mapped_file: 15_138_816,
                    pgfault: 21_120,
                    pgmajfault: 99,
                    pgpgin: 24_684,
                    pgpgout: 3806,
                    rss: 60_948_480,
                    rss_huge: 0,
                    total_active_anon: 61_095_936,
                    total_active_file: 6_217_728,
                    total_cache: 24_059_904,
                    total_dirty: 0,
                    total_inactive_anon: 0,
                    total_inactive_file: 17_571_840,
                    total_mapped_file: 15_138_816,
                    total_pgfault: 21_120,
                    total_pgmajfault: 99,
                    total_pgpgin: 24_684,
                    total_pgpgout: 3806,
                    total_rss: 60_948_480,
                    total_rss_huge: 0,
                    total_unevictable: 0,
                    total_writeback: 0,
                    unevictable: 0,
                    writeback: 0,
                },
                limit: 2_084_032_512,
            },
            name: '/conduit_api_1',
            id: '6e12b56c620f9c5257bf88e81fbb9f0a2cc5c5e3f099ab9a261cd3c8d79c7164',
            networks: {
                eth0: {
                    rx_bytes: 778,
                    rx_packets: 9,
                    rx_errors: 0,
                    rx_dropped: 0,
                    tx_bytes: 0,
                    tx_packets: 0,
                    tx_errors: 0,
                    tx_dropped: 0,
                },
            },
        },
        {
            read: '2020-11-04T10:07:41.965268398Z',
            preread: '2020-11-04T10:07:40.940136714Z',
            pids_stats: { current: 19 },
            blkio_stats: {
                io_service_bytes_recursive: [
                    { major: 254, minor: 0, op: 'Read', value: 22_536_192 },
                    { major: 254, minor: 0, op: 'Write', value: 0 },
                    { major: 254, minor: 0, op: 'Sync', value: 22_536_192 },
                    { major: 254, minor: 0, op: 'Async', value: 0 },
                    { major: 254, minor: 0, op: 'Discard', value: 0 },
                    { major: 254, minor: 0, op: 'Total', value: 22_536_192 },
                ],
                io_serviced_recursive: [
                    { major: 254, minor: 0, op: 'Read', value: 606 },
                    { major: 254, minor: 0, op: 'Write', value: 0 },
                    { major: 254, minor: 0, op: 'Sync', value: 606 },
                    { major: 254, minor: 0, op: 'Async', value: 0 },
                    { major: 254, minor: 0, op: 'Discard', value: 0 },
                    { major: 254, minor: 0, op: 'Total', value: 606 },
                ],
                io_queue_recursive: [],
                io_service_time_recursive: [],
                io_wait_time_recursive: [],
                io_merged_recursive: [],
                io_time_recursive: [],
                sectors_recursive: [],
            },
            num_procs: 0,
            // Storage_stats: {},
            cpu_stats: {
                cpu_usage: {
                    total_usage: 1_291_005_241,
                    percpu_usage: [394_494_247, 373_147_750, 230_943_580, 292_419_664],
                    usage_in_kernelmode: 330_000_000,
                    usage_in_usermode: 900_000_000,
                },
                system_cpu_usage: 2_335_240_000_000,
                online_cpus: 4,
                throttling_data: {
                    periods: 0,
                    throttled_periods: 0,
                    throttled_time: 0,
                },
            },
            precpu_stats: {
                cpu_usage: {
                    total_usage: 1_001_461_071,
                    percpu_usage: [249_727_566, 325_249_064, 175_364_138, 251_120_303],
                    usage_in_kernelmode: 250_000_000,
                    usage_in_usermode: 690_000_000,
                },
                system_cpu_usage: 2_331_680_000_000,
                online_cpus: 4,
                throttling_data: {
                    periods: 0,
                    throttled_periods: 0,
                    throttled_time: 0,
                },
            },
            memory_stats: {
                usage: 101_158_912,
                max_usage: 101_158_912,
                failcnt: 0,
                stats: {
                    active_anon: 68_935_680,
                    active_file: 6_217_728,
                    cache: 26_222_592,
                    dirty: 0,
                    hierarchical_memory_limit: 9_223_372_036_854_771_712,
                    hierarchical_memsw_limit: 9_223_372_036_854_771_712,
                    inactive_anon: 0,
                    inactive_file: 19_599_360,
                    mapped_file: 15_409_152,
                    pgfault: 23_265,
                    pgmajfault: 99,
                    pgpgin: 27_258,
                    pgpgout: 4029,
                    rss: 68_984_832,
                    rss_huge: 0,
                    total_active_anon: 68_935_680,
                    total_active_file: 6_217_728,
                    total_cache: 26_222_592,
                    total_dirty: 0,
                    total_inactive_anon: 0,
                    total_inactive_file: 19_599_360,
                    total_mapped_file: 15_409_152,
                    total_pgfault: 23_265,
                    total_pgmajfault: 99,
                    total_pgpgin: 27_258,
                    total_pgpgout: 4029,
                    total_rss: 68_984_832,
                    total_rss_huge: 0,
                    total_unevictable: 0,
                    total_writeback: 0,
                    unevictable: 0,
                    writeback: 0,
                },
                limit: 2_084_032_512,
            },
            name: '/conduit_api_1',
            id: '6e12b56c620f9c5257bf88e81fbb9f0a2cc5c5e3f099ab9a261cd3c8d79c7164',
            networks: {
                eth0: {
                    rx_bytes: 778,
                    rx_packets: 9,
                    rx_errors: 0,
                    rx_dropped: 0,
                    tx_bytes: 0,
                    tx_packets: 0,
                    tx_errors: 0,
                    tx_dropped: 0,
                },
            },
        },
    ];

    const res = docker.computeGenericStats(stats);

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
                availableSystemCpuUsage: 0.89,
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

test('sumBlkioStats', () => {
    expect(
        sumBlkioStats([
            { major: 8, minor: 0, op: 'Write', value: 200 },
            { major: 8, minor: 0, op: 'Total', value: 300 },
            { major: 8, minor: 0, op: 'Write', value: 200 },
            { major: 8, minor: 0, op: 'Total', value: 300 },
            { major: 8, minor: 1, op: 'Write', value: 400 },
            { major: 8, minor: 1, op: 'Total', value: 500 },
        ])
    ).toBe(800);
});
