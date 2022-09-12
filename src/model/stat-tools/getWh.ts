// import * as assert from "assert";

import {
    getComputedStat,
    getContainers,
    getContainerType,
    getSamples,
    StatStore,
} from '../stores/statStore';

import { getTitles, TimeFrameStore } from '../stores/timeframeStore';

import type {
    EnergyProfile,
    MetricsContainer,
    MetricsPerContainer,
    ValueOf,
    WhPerTimeFrame,
    // WhSummary,
} from '../../types';

import { CONTAINER_TYPES } from '../../constants';

const CARBON_INTENSITY = 442; // unit: g/kWh
export const whToCO2 = (wh: number): number => (wh * CARBON_INTENSITY) / 1000; // unit: g

const computeAverageWh = ({
    cpus,
    mems,
    disks,
    networks,
    screens,
    totalTimes,
    containerType,
    energyProfile,
}: {
    cpus: (number | undefined)[];
    mems: (number | undefined)[];
    disks: (number | undefined)[];
    networks: (number | undefined)[];
    screens: (number | undefined)[];
    totalTimes: (number | undefined)[];
    containerType: ValueOf<typeof CONTAINER_TYPES>;
    energyProfile: EnergyProfile;
}): MetricsContainer => {
    const average = (arr: number[]) =>
        arr.reduce((acc: number, value) => acc + value, 0) / arr.length;

    const filterDef = (arr: (number | undefined)[]): number[] =>
        arr.filter((value) => value !== undefined) as number[];

    const cypressOverhead = 1;

    const cpuAverage = average(filterDef(cpus));
    const memAverage = average(filterDef(mems));
    const diskAverage = average(filterDef(disks));
    const networkAverage = average(filterDef(networks));
    const screenAverage = average(filterDef(screens));
    const totalTimeAverage = average(filterDef(totalTimes));
    const pue = containerType === CONTAINER_TYPES.DEVICE ? 1 : energyProfile.PUE;

    const cpuWh = (pue * (cpuAverage * energyProfile.CPU)) / 3600;
    const memWh =
        pue *
        average(
            filterDef(mems).map(
                (mem, index) =>
                    mem * energyProfile.MEM * ((totalTimes[index] as number) / 3600)
            )
        );
    const diskWh = pue * diskAverage * energyProfile.DISK;
    // No PUE for network and screen
    const networkWh = (networkAverage * energyProfile.NETWORK) / 2; // To count I/O only once,
    const screenWh = (screenAverage * energyProfile.SCREEN) / 3600;

    const wh = {
        cpu: cypressOverhead * cpuWh,
        mem: cypressOverhead * memWh,
        disk: diskWh,
        network: networkWh,
        screen: cypressOverhead * screenWh,
        total: cypressOverhead * (cpuWh + memWh + screenWh) + diskWh + networkWh,
    };

    return {
        s: {
            cpu: cpuAverage,
            screen: screenAverage,
            totalTime: totalTimeAverage,
        },
        gb: {
            mem: memAverage,
            disk: diskAverage,
            network: networkAverage,
        },
        wh,
        co2: {
            cpu: whToCO2(wh.cpu),
            mem: whToCO2(wh.mem),
            disk: whToCO2(wh.disk),
            network: whToCO2(wh.network),
            screen: whToCO2(wh.screen),
            total: whToCO2(wh.total),
        },
    };
};

export const getWhForContainerBySamples = (
    store: StatStore,
    energyProfile: EnergyProfile,
    container: string,
    containerType: ValueOf<typeof CONTAINER_TYPES>,
    timeFrameTitle?: string
): MetricsContainer[] => {
    const samples = getSamples(store);

    return samples.map((sample) => {
        const computedStat = getComputedStat(store, {
            container,
            type: containerType,
            sample,
            timeFrameTitle,
        });

        return computeAverageWh({
            cpus: [computedStat?.cpuUsage],
            mems: [computedStat?.memoryUsage],
            disks: [computedStat?.disk],
            networks: [computedStat?.network],
            screens: [
                containerType === CONTAINER_TYPES.DEVICE ? computedStat?.userTime : 0,
            ],
            totalTimes: [computedStat?.time],
            containerType,
            energyProfile,
        });
    });
};

export const getWhForContainer = (
    store: StatStore,
    energyProfile: EnergyProfile,
    container: string,
    containerType: ValueOf<typeof CONTAINER_TYPES>,
    timeFrameTitle?: string
): MetricsContainer => {
    const samples = getSamples(store);

    const computedStats = samples.map((sample) =>
        getComputedStat(store, {
            container,
            sample,
            timeFrameTitle,
            type: containerType,
        })
    );

    const { totalTimes, cpus, mems, disks, networks, screens } = computedStats.reduce(
        (acc, stat) => {
            if (stat) {
                acc.totalTimes.push(stat.time);
                acc.cpus.push(stat.cpuUsage);
                acc.mems.push(stat.memoryUsage);
                acc.disks.push(stat.disk);
                acc.networks.push(stat.network);
                acc.screens.push(
                    containerType === CONTAINER_TYPES.DEVICE ? stat.userTime : 0
                );
            }

            return acc;
        },
        {
            totalTimes: <number[]>[],
            cpus: <number[]>[],
            mems: <number[]>[],
            disks: <number[]>[],
            networks: <number[]>[],
            screens: <number[]>[],
        }
    );

    return computeAverageWh({
        cpus,
        mems,
        disks,
        networks,
        screens,
        totalTimes,
        containerType,
        energyProfile,
    });
};

export const getMetricsPerContainer = (
    store: StatStore,
    energyProfile: EnergyProfile,
    timeFrameTitle?: string
): MetricsPerContainer => {
    const containers = getContainers(store);
    const whPerContainer: MetricsPerContainer = {};
    for (const container of containers) {
        const type = getContainerType(store, container);
        const metricContainer = getWhForContainer(
            store,
            energyProfile,
            container,
            type,
            timeFrameTitle
        );
        whPerContainer[container] = metricContainer;
    }

    return whPerContainer;
};

export const getMetricsPerContainerPerSamples = (
    store: StatStore,
    energyProfile: EnergyProfile,
    timeFrameTitle?: string
): {
    [key: string]: MetricsContainer[];
} => {
    const containers = getContainers(store);
    const metricsPerContainerBySamples: {
        [key: string]: MetricsContainer[];
    } = {};
    for (const container of containers) {
        const type = getContainerType(store, container);
        const metricsContainerBySamples = getWhForContainerBySamples(
            store,
            energyProfile,
            container,
            type,
            timeFrameTitle
        );
        metricsPerContainerBySamples[container] = metricsContainerBySamples;
    }

    return metricsPerContainerBySamples;
};

const initMetricsContainer = (): MetricsContainer => ({
    s: {
        cpu: 0,
        screen: 0,
        totalTime: 0,
    },
    gb: {
        mem: 0,
        disk: 0,
        network: 0,
    },
    wh: {
        cpu: 0,
        mem: 0,
        disk: 0,
        network: 0,
        screen: 0,
        total: 0,
    },
    co2: {
        cpu: 0,
        mem: 0,
        disk: 0,
        network: 0,
        screen: 0,
        total: 0,
    },
});
export const addMetricsContainer = (
    total: MetricsContainer = initMetricsContainer(),
    metricContainer: MetricsContainer
): MetricsContainer => {
    for (const [key, object] of Object.entries(total)) {
        for (const [subKey, metric] of Object.entries(object)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (<any>total)[key][subKey] = metric + (<any>metricContainer)[key][subKey];
        }
    }

    return total;
};

export const getRevisionWhForTimeframes = (
    store: StatStore,
    timeframeStore: TimeFrameStore,
    energyProfile: EnergyProfile,
    container: string,
    containerType: ValueOf<typeof CONTAINER_TYPES>
): WhPerTimeFrame => {
    const timeFrameTitles = getTitles(timeframeStore);
    const whPerTimeframe: WhPerTimeFrame = {};
    for (const title of timeFrameTitles) {
        const whPerContainer = getWhForContainer(
            store,
            energyProfile,
            container,
            containerType,
            title
        );
        whPerTimeframe[title] = whPerContainer;
    }

    return whPerTimeframe;
};

// const getTotal = (whPerContainer: MetricsPerContainer): number =>
//     Object.values(whPerContainer).reduce(
//         (acc, containerInfo) => acc + containerInfo.wh.total,
//         0,
//     );

// export const getSummary = (whPerContainer: MetricsPerContainer): WhSummary => {
//     const total = getTotalWh(whPerContainer);

//     const network = Object.values(whPerContainer).reduce(
//         (acc, containerInfo) => acc + containerInfo.wh.network,
//         0,
//     );

//     const server = Object.keys(whPerContainer).reduce((acc, container) => {
//         const wh = whPerContainer[container].wh;
//         const containerType = getContainerType(container);
//         const isServerOrDB =
//             containerType === CONTAINER_TYPE.SERVER ||
//             containerType === CONTAINER_TYPE.DATABASE;

//         return acc + (isServerOrDB ? wh.cpu + wh.mem + wh.disk + wh.screen : 0);
//     }, 0);

//     const device = Object.keys(whPerContainer).reduce((acc, container) => {
//         const wh = whPerContainer[container].wh;
//         const containerType = getContainerType(container);
//         return (
//             acc +
//             (containerType === CONTAINER_TYPE.DEVICE
//                 ? wh.cpu + wh.mem + wh.disk + wh.screen
//                 : 0)
//         );
//     }, 0);

//     assert.ok(Math.abs(network + server + device - total) < 1e-3);

//     return { total, server, network, device };
// };
