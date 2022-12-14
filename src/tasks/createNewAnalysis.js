const ConfigurationError = require('../services/errors/ConfigurationError');

const { readFileToString } = require('../services/readFileToString');
const { createAnalysis } = require('../services/api/analyses');
const createNewAnalysis = async (ctx) => {
    const { args, flags, configFilePath } = ctx;
    if (flags.distant) {
        for (let index = 0; index < args.scenarios.length; index++) {
            const scenario = args.scenarios[index];
            args.scenarios[index].content = await readFileToString(
                configFilePath,
                scenario.path
            );
        }
    }

    try {
        const { data } = await createAnalysis({
            scenarios: args.scenarios,
            baseURL: args.baseURL,
            threshold: flags.threshold,
            samples: flags.samples,
            distant: flags.distant,
            useAdblock: flags.useAdblock,
            projectName: ctx.projectName,
            gitInfos: ctx.gitInfos,
        });
        ctx.analysisId = data.id;
    } catch (error_) {
        const error =
            error_.response?.status === 401
                ? new ConfigurationError(
                      `Unauthorized access: ${
                          error_.response?.data ||
                          "Check your API TOKEN or your user's subscription."
                      }`
                  )
                : error_;
        throw error;
    }
};

module.exports = createNewAnalysis;
