import initDebug from 'debug';
import { STATUS } from '../../status.js';
import { Analysis } from '../../types.js';
import { AnalysisResult } from '../computeAnalysisResult.js';
import instance from './instance.js';

const debug = initDebug('greenframe:services:api:analyses');

export const createAnalysis = async ({
    scenarios,
    baseURL,
    samples,
    useAdblock,
    projectName,
    gitInfos,
    locale,
    timezoneId,
    ignoreHTTPSErrors,
}: Analysis) => {
    const { commitMessage, branchName, commitId, defaultBranchCommitReference } =
        gitInfos;

    debug('createAnalysis');
    return instance.post<any, { data: { id: string } }>('/analyses', {
        scenarios,
        url: baseURL,
        samples,
        useAdblock,
        projectName,
        gitCommitMessage: commitMessage,
        gitBranchName: branchName,
        gitCommitId: commitId,
        gitDefaultBranchCommitReference: defaultBranchCommitReference,
        locale,
        timezoneId,
        ignoreHTTPSErrors,
    });
};

export const getAnalysis = (id: string) => {
    debug('getAnalysis', id);
    return instance.get<any>(`/analyses/${id}`);
};

export const checkAnalysis = (id: string) => {
    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            const { data } = await getAnalysis(id);
            if (data.status !== STATUS.INITIAL) {
                clearInterval(interval);
                resolve(data);
            }
        }, 5000);
    });
};

export const saveFailedAnalysis = async (
    analysisId: string,
    { errorCode, errorMessage }: { errorCode: string; errorMessage: string }
) => {
    debug('saveFailedAnalysis', analysisId);
    return instance.post(`/analyses/${analysisId}/failed`, {
        errorCode,
        errorMessage: errorMessage.toString(),
    });
};

export const saveFinishedAnalysis = async (
    analysisId: string,
    analysisResult: AnalysisResult
) => {
    debug('saveFinishedAnalysis', analysisId);
    return instance.put(`/analyses/${analysisId}`, analysisResult);
};
