import { getAverageMilestones } from '../getAverageMilestones';

describe('#getAverageMilestones', () => {
    it('Should return min milestones for each samples', () => {
        const milestonesPerSamples = [
            [
                {
                    title: 'Milestone 1',
                    time: 1000,
                },
                {
                    title: 'Milestone 2',
                    time: 1145,
                },
                {
                    title: 'Milestone 3',
                    time: 12_678,
                },
            ],
            [
                {
                    title: 'Milestone 1',
                    time: 1500,
                },
                {
                    title: 'Milestone 2',
                    time: 2047,
                },
                {
                    title: 'Milestone 3',
                    time: 13_458,
                },
            ],
            [
                {
                    title: 'Milestone 1',
                    time: 2000,
                },
                {
                    title: 'Milestone 2',
                    time: 2457,
                },
                {
                    title: 'Milestone 3',
                    time: 15_000,
                },
            ],
        ];

        const milestones = getAverageMilestones(milestonesPerSamples);

        expect(milestones).toEqual([
            {
                title: 'Milestone 1',
                time: 1500,
            },
            {
                title: 'Milestone 2',
                time: 1883,
            },
            {
                title: 'Milestone 3',
                time: 13_712,
            },
        ]);
    });
});
