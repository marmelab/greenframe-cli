import { ERROR_CODES } from '../constants';
import { mergeScores } from '../index';
import { MetricsContainer, ValueOf } from '../types';
import { ScenarioResult } from './computeScenarioResult';

export type AnalysisResult = {
    score?: MetricsContainer;
    errorCode?: ValueOf<typeof ERROR_CODES>;
    errorMessage?: string;
    scenarios: ScenarioResult[];
};

export const computeAnalysisResult = (scenarios: ScenarioResult[]): AnalysisResult => {
    // Compute all scenarios to get the final global score
    const { errorCode, score } = scenarios.reduce(
        (
            acc: { errorCode?: ValueOf<typeof ERROR_CODES>; score?: MetricsContainer },
            scenario: ScenarioResult
        ) => {
            if (scenario.errorCode) {
                acc.errorCode = scenario.errorCode as
                    | ValueOf<typeof ERROR_CODES>
                    | undefined;
            }

            if (scenario.score?.wh) {
                acc.score = acc.score
                    ? mergeScores(acc.score, scenario.score)
                    : scenario.score;
            }

            return acc;
        },
        {
            score: {
                s: { cpu: 0, screen: 0, totalTime: 0 },
                gb: {
                    mem: 0,
                    disk: 0,
                    network: 0,
                },
                wh: {
                    cpu: 0,
                    mem: 0,
                    disk: 0,
                    total: 0,
                    screen: 0,
                    network: 0,
                },
                co2: {
                    cpu: 0,
                    mem: 0,
                    disk: 0,
                    total: 0,
                    screen: 0,
                    network: 0,
                },
            },
        }
    );

    return {
        score,
        errorCode,
        scenarios,
    };
};
