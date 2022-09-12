import { getAverageStats } from '../getAverageStats';
import { addAvg, incrementalAverageStats } from '../getAverageStats';

const incrementalStat = (n: any, statValue: any, boolValue: any) => {
    return {
        n: n,
        time: statValue,
        active: boolValue,
        userTime: statValue,
        timeframe: undefined,
        date: '2021-07-12T12:27:11.945Z',
        io: {
            totalBytes: statValue,
            currentBytes: statValue,
        },
        cpu: {
            cpuPercentage: statValue,
            totalUsageInUserMode: statValue,
            currentUsageInUserMode: statValue,
            totalUsageInKernelMode: statValue,
            availableSystemCpuUsage: statValue,
            currentUsageInKernelMode: statValue,
        },
        memory: {
            usage: statValue,
        },
        network: {
            totalReceived: statValue,
            currentReceived: statValue,
            totalTransmitted: statValue,
            currentTransmitted: statValue,
        },
    };
};

const inputStat = (sample: any, statValue: any) => {
    return {
        ...incrementalStat(0, statValue, true),
        meta: {
            sample: sample,
            container: 'playwright',
        },
    };
};

const outputStat = (n: any, statValue: any) => {
    return incrementalStat(n, statValue, true);
};

describe('Unit test util functions', () => {
    it('incrementalStat', () => {
        expect(incrementalStat(0, 0, false)).toEqual({
            n: 0,
            time: 0,
            active: false,
            userTime: 0,
            timeframe: undefined,
            date: '2021-07-12T12:27:11.945Z',
            io: {
                totalBytes: 0,
                currentBytes: 0,
            },
            cpu: {
                cpuPercentage: 0,
                totalUsageInUserMode: 0,
                currentUsageInUserMode: 0,
                totalUsageInKernelMode: 0,
                availableSystemCpuUsage: 0,
                currentUsageInKernelMode: 0,
            },
            memory: {
                usage: 0,
            },
            network: {
                totalReceived: 0,
                currentReceived: 0,
                totalTransmitted: 0,
                currentTransmitted: 0,
            },
        });
        expect(incrementalStat(2, 10.5, true)).toEqual({
            n: 2,
            time: 10.5,
            active: true,
            userTime: 10.5,
            timeframe: undefined,
            date: '2021-07-12T12:27:11.945Z',
            io: {
                totalBytes: 10.5,
                currentBytes: 10.5,
            },
            cpu: {
                cpuPercentage: 10.5,
                totalUsageInUserMode: 10.5,
                currentUsageInUserMode: 10.5,
                totalUsageInKernelMode: 10.5,
                availableSystemCpuUsage: 10.5,
                currentUsageInKernelMode: 10.5,
            },
            memory: {
                usage: 10.5,
            },
            network: {
                totalReceived: 10.5,
                currentReceived: 10.5,
                totalTransmitted: 10.5,
                currentTransmitted: 10.5,
            },
        });
    });

    it('inputStat', () => {
        expect(inputStat(0, 0)).toEqual({
            n: 0,
            time: 0,
            active: true,
            userTime: 0,
            timeframe: undefined,
            date: '2021-07-12T12:27:11.945Z',
            io: {
                totalBytes: 0,
                currentBytes: 0,
            },
            cpu: {
                cpuPercentage: 0,
                totalUsageInUserMode: 0,
                currentUsageInUserMode: 0,
                totalUsageInKernelMode: 0,
                availableSystemCpuUsage: 0,
                currentUsageInKernelMode: 0,
            },
            memory: {
                usage: 0,
            },
            network: {
                totalReceived: 0,
                currentReceived: 0,
                totalTransmitted: 0,
                currentTransmitted: 0,
            },
            meta: {
                sample: 0,
                container: 'playwright',
            },
        });
        expect(inputStat(1, 8.2)).toEqual({
            n: 0,
            time: 8.2,
            active: true,
            userTime: 8.2,
            timeframe: undefined,
            date: '2021-07-12T12:27:11.945Z',
            io: {
                totalBytes: 8.2,
                currentBytes: 8.2,
            },
            cpu: {
                cpuPercentage: 8.2,
                totalUsageInUserMode: 8.2,
                currentUsageInUserMode: 8.2,
                totalUsageInKernelMode: 8.2,
                availableSystemCpuUsage: 8.2,
                currentUsageInKernelMode: 8.2,
            },
            memory: {
                usage: 8.2,
            },
            network: {
                totalReceived: 8.2,
                currentReceived: 8.2,
                totalTransmitted: 8.2,
                currentTransmitted: 8.2,
            },
            meta: {
                sample: 1,
                container: 'playwright',
            },
        });
    });

    it('outputStat', () => {
        expect(outputStat(0, 0)).toEqual({
            n: 0,
            time: 0,
            active: true,
            userTime: 0,
            timeframe: undefined,
            date: '2021-07-12T12:27:11.945Z',
            io: {
                totalBytes: 0,
                currentBytes: 0,
            },
            cpu: {
                cpuPercentage: 0,
                totalUsageInUserMode: 0,
                currentUsageInUserMode: 0,
                totalUsageInKernelMode: 0,
                availableSystemCpuUsage: 0,
                currentUsageInKernelMode: 0,
            },
            memory: {
                usage: 0,
            },
            network: {
                totalReceived: 0,
                currentReceived: 0,
                totalTransmitted: 0,
                currentTransmitted: 0,
            },
        });
        expect(outputStat(3, 7.8)).toEqual({
            n: 3,
            time: 7.8,
            active: true,
            userTime: 7.8,
            timeframe: undefined,
            date: '2021-07-12T12:27:11.945Z',
            io: {
                totalBytes: 7.8,
                currentBytes: 7.8,
            },
            cpu: {
                cpuPercentage: 7.8,
                totalUsageInUserMode: 7.8,
                currentUsageInUserMode: 7.8,
                totalUsageInKernelMode: 7.8,
                availableSystemCpuUsage: 7.8,
                currentUsageInKernelMode: 7.8,
            },
            memory: {
                usage: 7.8,
            },
            network: {
                totalReceived: 7.8,
                currentReceived: 7.8,
                totalTransmitted: 7.8,
                currentTransmitted: 7.8,
            },
        });
    });
});

describe('addAvg', () => {
    it('Should return the new average for positive values', () => {
        expect(addAvg(1, 0, 0)).toBe(1);
        expect(addAvg(2, 1, 1)).toBe(1.5);
        expect(addAvg(3, 1.5, 2)).toBe(2);
        expect(addAvg(4, 2, 3)).toBe(2.5);
        expect(addAvg(5, 2.5, 4)).toBe(3);
        expect(addAvg(100, 10, 79)).toBe(11.125);
        expect(addAvg(5000, 0, 499)).toBe(10);
    });

    it('Should handle NaN as 0', () => {
        expect(addAvg(Number.NaN, 10, 99)).toBe(9.9);
        expect(addAvg(Number.NaN, 0, 50)).toBe(0);
    });

    it('Should return the new average for constant value', () => {
        expect(addAvg(6, 0, 0)).toBe(6);
        expect(addAvg(6, 6, 1)).toBe(6);
        expect(addAvg(6, 6, 2)).toBe(6);
        expect(addAvg(6, 6, 10_000_000)).toBe(6);
    });
});

describe('incrementalAverageStats', () => {
    it('Should return the incremental average of a stats list', () => {
        /*
        Entry data
            Entries: [50, 10, 30, 50, 60]
        
        Expected output
            Incremental average: [50, 30, 30, 35, 40]
        */
        expect(
            incrementalAverageStats(
                incrementalStat(0, 0, false),
                incrementalStat(1, 50, true)
            )
        ).toEqual(incrementalStat(1, 50, true));

        expect(
            incrementalAverageStats(
                incrementalStat(1, 50, true),
                incrementalStat(2, 10, true)
            )
        ).toEqual(incrementalStat(2, 30, true));

        expect(
            incrementalAverageStats(
                incrementalStat(2, 30, true),
                incrementalStat(3, 30, true)
            )
        ).toEqual(incrementalStat(3, 30, true));

        expect(
            incrementalAverageStats(
                incrementalStat(3, 30, true),
                incrementalStat(4, 50, true)
            )
        ).toEqual(incrementalStat(4, 35, true));

        expect(
            incrementalAverageStats(
                incrementalStat(4, 35, true),
                incrementalStat(5, 60, true)
            )
        ).toEqual(incrementalStat(5, 40, true));
    });
});

describe('getAverageStats', () => {
    it('Should return accurate average stats for samples with same length', () => {
        /*
        Entry data
            Sample 1: [10, 10, 10]
            Sample 2: [20, 20, 20]
            Sample 3: [30, 30, 30]
        */
        const computedStats = [
            inputStat(1, 10),
            inputStat(1, 10),
            inputStat(1, 10),
            inputStat(2, 20),
            inputStat(2, 20),
            inputStat(2, 20),
            inputStat(3, 30),
            inputStat(3, 30),
            inputStat(3, 30),
        ];

        /*
        Expected output
            Average: [20, 20, 20]
        */
        const expectedOutput = [outputStat(3, 20), outputStat(3, 20), outputStat(3, 20)];

        const result = getAverageStats(computedStats);

        expect(result).toEqual(expectedOutput);
    });

    it('Should return accurate average stats for samples with different lengths', () => {
        /*
        Entry data
            Sample 1: [10, 20, 30, 40, 50, 60]
            Sample 2: [40, 40, 70, 40]
            Sample 3: [30, 30, 80, 40, 40]
        */
        const computedStats = [
            inputStat(1, 10),
            inputStat(1, 20),
            inputStat(1, 30),
            inputStat(1, 40),
            inputStat(1, 50),
            inputStat(1, 60),
            inputStat(2, 40),
            inputStat(2, 40),
            inputStat(2, 70),
            inputStat(2, 40),
            inputStat(3, 100),
            inputStat(3, 30),
            inputStat(3, 80),
            inputStat(3, 40),
            inputStat(3, 40),
        ];

        /*
        Expected output
            Average: [50, 30, 60, 40]
        */
        const expectedOutput = [
            outputStat(3, 50),
            outputStat(3, 30),
            outputStat(3, 60),
            outputStat(3, 40),
        ];

        const result = getAverageStats(computedStats);

        expect(result).toEqual(expectedOutput);
    });
});
