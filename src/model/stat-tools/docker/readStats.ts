import * as fs from 'node:fs';
import type {
    DockerStatsJSON,
    Meta,
    IntervalJSON,
    ComputedStatWithMeta,
} from '../../../types';

import { docker } from '../providers/docker';
import { computeStats } from './computeStats';

export const readDockerStats = (filename: string, meta: Meta): ComputedStatWithMeta[] => {
    const rawdata = fs.readFileSync(filename, 'utf8');
    const { stats, intervals }: { stats: DockerStatsJSON[]; intervals: IntervalJSON[] } =
        JSON.parse(rawdata);
    const timeframes = intervals.map(({ started, ended, title }) => ({
        start: new Date(started),
        end: new Date(ended),
        title,
    }));
    const computedStats = computeStats({
        stats: docker.computeGenericStats(stats),
        timeframes,
        meta,
    });
    return computedStats;
};
