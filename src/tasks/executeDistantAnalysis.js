const { checkAnalysis } = require('../services/api/analyses');

const { findAllScenariosByAnalysisId } = require('../services/api/scenarios');

module.exports = async (ctx) => {
    const { analysisId } = ctx;
    const analysis = await checkAnalysis(analysisId);
    const { data: scenarios } = await findAllScenariosByAnalysisId(analysisId);
    ctx.result = { analysis, scenarios };
};
