import { CONTAINER_TYPES } from '../../../../constants';
import { GenericStat } from '../../../../types';
import { computeStats } from '../computeStats';

test('computeStats', () => {
    const stats: GenericStat[] = [
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
    ];

    const res = computeStats({
        stats,
        timeframes: [
            {
                start: new Date('2020-11-04T10:07:39.000Z'),
                end: new Date('2020-11-04T10:07:43.000Z'),
                title: 'title',
            },
        ],
        meta: {
            sample: 0,
            container: 'c0',
            type: CONTAINER_TYPES.SERVER,
        },
    });

    expect(res).toHaveLength(1);

    expect(res).toEqual([
        {
            meta: { sample: 0, container: 'c0', type: 'SERVER' },
            active: true,
            time: 1.025,
            userTime: 1.025,
            date: new Date('2020-11-04T10:07:41.965Z'),
            ratio: 1,
            timeframe: {
                end: new Date('2020-11-04T10:07:43.000Z'),
                start: new Date('2020-11-04T10:07:39.000Z'),
                title: 'title',
            },
            cpu: {
                availableSystemCpuUsage: 0.868_292_682_926_829_4,
                cpuPercentage: 5.898_876_404_494_381_6,
                totalUsageInUserMode: 0.0525,
                totalUsageInKernelMode: 0.02,
                currentUsageInUserMode: 0.051_219_512_195_121_955,
                // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                currentUsageInKernelMode: 0.019_512_195_121_951_223_2,
            },
            io: {
                // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                currentBytes: 295_711.219_512_195_154,
                totalBytes: 303_104,
            },
            network: {
                currentReceived: 0,
                currentTransmitted: 0,
                totalReceived: 0,
                totalTransmitted: 0,
            },
            memory: { usage: 101_158_912 },
        },
    ]);
});
