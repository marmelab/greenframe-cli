import { ListrContext } from 'listr2';
import { checkAnalysis } from '../services/api/analyses.js';
import { findAllScenariosByAnalysisId } from '../services/api/scenarios.js';

export default async (ctx: ListrContext) => {
    const { analysisId } = ctx;
    const analysis = await checkAnalysis(analysisId);
    const { data: scenarios } = await findAllScenariosByAnalysisId(analysisId);
    ctx.result = { analysis, scenarios };
};
