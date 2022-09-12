import type { TimeFrameWithMeta } from '../../../types';
import type { TimeFrameStore } from '../timeframeStore';
import { createTimeFrameStore, getTitles } from '../timeframeStore';

const generator = [
    [0, 0, '00:00:00Z', '00:00:01Z', 'title 0 0 - milestone 1'],
    [0, 0, '00:00:01Z', '00:00:02Z', 'title 0 0 - milestone 2'],
    [0, 0, '00:00:02Z', '00:00:03Z', 'title 0 0 - milestone 3'],
    [0, 1, '00:01:00Z', '00:01:01Z', 'title 0 1 - milestone 1'],
    [0, 1, '00:01:01Z', '00:01:02Z', 'title 0 1 - milestone 2'],
    [0, 1, '00:01:02Z', '00:01:03Z', 'title 0 1 - milestone 3'],
    [1, 0, '00:02:00Z', '00:02:01Z', 'title 1 0 - milestone 1'],
    [1, 0, '00:02:01Z', '00:02:02Z', 'title 1 0 - milestone 2'],
    [1, 0, '00:02:02Z', '00:02:03Z', 'title 1 0 - milestone 3'],
    [1, 1, '00:03:00Z', '00:03:01Z', 'title 1 1 - milestone 1'],
    [1, 1, '00:03:01Z', '00:03:02Z', 'title 1 1 - milestone 2'],
    [1, 1, '00:03:02Z', '00:03:03Z', 'title 1 1 - milestone 3'],
];

const data: TimeFrameWithMeta[] = generator.map(
    ([container, sample, start, end, title]) =>
        ({
            meta: {
                sample,
                container: `c${container}`,
            },
            start: new Date(`2020-01-01T${start}`),
            end: new Date(`2020-01-01T${end}`),
            title,
        } as TimeFrameWithMeta)
);

let store: TimeFrameStore;
beforeEach(() => {
    store = createTimeFrameStore(data);
});

test.each<[ReturnType<typeof getTitles>]>([
    [
        [
            'title 0 0 - milestone 1',
            'title 0 0 - milestone 2',
            'title 0 0 - milestone 3',
            'title 1 0 - milestone 1',
            'title 1 0 - milestone 2',
            'title 1 0 - milestone 3',
            'title 0 1 - milestone 1',
            'title 0 1 - milestone 2',
            'title 0 1 - milestone 3',
            'title 1 1 - milestone 1',
            'title 1 1 - milestone 2',
            'title 1 1 - milestone 3',
        ],
    ],
])('getTitles %#', (result) => {
    expect(new Set(getTitles(store))).toEqual(new Set(result));
});
