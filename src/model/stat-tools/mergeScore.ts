import { MetricsContainer } from '../../types';

export const mergeScores = (
    score: MetricsContainer,
    newScore: MetricsContainer
): MetricsContainer => {
    return {
        s: {
            cpu: score.s.cpu + newScore.s.cpu,
            screen: score.s.screen + newScore.s.screen,
            totalTime: score.s.totalTime + newScore.s.totalTime,
        },
        gb: {
            mem: score.gb.mem + newScore.gb.mem,
            disk: score.gb.disk + newScore.gb.disk,
            network: score.gb.network + newScore.gb.network,
        },
        wh: {
            cpu: score.wh.cpu + newScore.wh.cpu,
            mem: score.wh.mem + newScore.wh.mem,
            disk: score.wh.disk + newScore.wh.disk,
            total: score.wh.total + newScore.wh.total,
            screen: score.wh.screen + newScore.wh.screen,
            network: score.wh.network + newScore.wh.network,
        },
        co2: {
            cpu: score.co2.cpu + newScore.co2.cpu,
            mem: score.co2.mem + newScore.co2.mem,
            disk: score.co2.disk + newScore.co2.disk,
            total: score.co2.total + newScore.co2.total,
            screen: score.co2.screen + newScore.co2.screen,
            network: score.co2.network + newScore.co2.network,
        },
    };
};
