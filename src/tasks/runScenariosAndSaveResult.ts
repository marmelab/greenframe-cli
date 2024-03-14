import initDebug from 'debug';
import { ListrContext } from 'listr2';
import { saveFinishedAnalysis } from '../services/api/analyses.js';
import { computeAnalysisResult } from '../services/computeAnalysisResult.js';
import {
    computeScenarioResult,
    ScenarioResult,
} from '../services/computeScenarioResult.js';
import { executeScenarioAndGetContainerStats } from '../services/container/index.js';
import ConfigurationError from '../services/errors/ConfigurationError.js';
import ERROR_CODES from '../services/errors/errorCodes.js';

const debug = initDebug('greenframe:tasks:runScenarioAndSaveResults');

export default async (ctx: ListrContext) => {
    const { analysisId, args, flags } = ctx;
    const resultScenarios: ScenarioResult[] = [];
    for (let index = 0; index < args.scenarios.length; index++) {
        const scenario = args.scenarios[index];

        debug(`Running scenario ${scenario.path}...`);

        try {
            const { allContainers, allMilestones } =
                await executeScenarioAndGetContainerStats({
                    scenario: scenario.path,
                    url: args.baseURL,
                    samples: flags.samples,
                    useAdblock: flags.useAdblock,
                    containers: flags.containers,
                    databaseContainers: flags.databaseContainers,
                    kubeContainers: flags.kubeContainers,
                    kubeDatabaseContainers: flags.kubeDatabaseContainers,
                    extraHosts: flags.extraHosts,
                    envVars: flags.envVar,
                    envFile: flags.envFile,
                    dockerdHost: flags.dockerdHost,
                    dockerdPort: flags.dockerdPort,
                    ignoreHTTPSErrors: flags.ignoreHTTPSErrors,
                    locale: flags.locale,
                    timezoneId: flags.timezoneId,
                });

            const data = computeScenarioResult({
                allContainersStats: allContainers,
                milestones: allMilestones,
                threshold: scenario.threshold,
                name: scenario.name,
                executionCount: scenario.executionCount,
            });
            resultScenarios.push(data);
        } catch (error) {
            // If the error is not due to scenario but a problem inside the configuration
            // Running others scenario is not useful, so let's stop the command.
            if (error instanceof ConfigurationError) {
                throw error;
            }

            if (error instanceof Error) {
                debug('Error while running scenario', error);
                const data = computeScenarioResult({
                    threshold: scenario.threshold,
                    name: scenario.name,
                    errorCode: ERROR_CODES.SCENARIO_FAILED,
                    errorMessage: error.message,
                    executionCount: scenario.executionCount,
                });
                resultScenarios.push(data);
            }
        }
    }

    const result = computeAnalysisResult(resultScenarios);
    if (!ctx.isFree) {
        const { data: analysis } = await saveFinishedAnalysis(analysisId, result);
        ctx.result = { analysis, scenarios: resultScenarios, computed: result };
    } else {
        ctx.result = {
            analysis: undefined,
            scenarios: resultScenarios,
            computed: result,
        };
    }
};
