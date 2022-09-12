import { Milestone } from '../../types';

export const getAverageMilestones = (milestonesPerSamples: Milestone[][]) => {
    const samples = milestonesPerSamples.length;
    return milestonesPerSamples.reduce<Milestone[]>(
        (milestones: Milestone[], milestonesForOneSample: Milestone[]) => {
            milestonesForOneSample.forEach(
                (
                    {
                        title,
                        time,
                    }: {
                        title: string;
                        time: number;
                    },
                    index: number
                ) => {
                    if (!milestones[index]) {
                        milestones[index] = { title, time: time / samples };
                    } else {
                        milestones[index].time += time / samples;
                    }
                }
            );
            return milestones;
        },
        []
    );
};
