import initDebug from 'debug';
import instance from './instance';

const debug = initDebug('greenframe:services:api:scenarios');

export const createScenario = async ({
    analysisId,
    name,
    threshold,
    allContainers,
    allMilestones,
    errorCode,
    errorMessage,
}: any) => {
    debug(`Post scenario to api \n`, {
        name,
        threshold,
        statsSize: allContainers.length,
        errorCode,
        errorMessage,
    });
    return instance.post(`/analyses/${analysisId}/scenarios`, {
        name,
        threshold,
        allContainersStats: allContainers,
        milestones: allMilestones,
        errorCode,
        errorMessage,
    });
};

export const findAllScenariosByAnalysisId = async (analysisId: string) =>
    instance.get(`/analyses/${analysisId}/scenarios`);
