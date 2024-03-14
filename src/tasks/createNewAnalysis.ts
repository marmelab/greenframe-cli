import { ListrContext } from 'listr2';
import { createAnalysis } from '../services/api/analyses.js';
import ConfigurationError from '../services/errors/ConfigurationError.js';
import axios from 'axios';

const createNewAnalysis = async (ctx: ListrContext) => {
    const { args, flags } = ctx;

    try {
        const { data } = await createAnalysis({
            scenarios: args.scenarios,
            baseURL: args.baseURL,
            samples: flags.samples,
            useAdblock: flags.useAdblock,
            locale: flags.locale,
            timezoneId: flags.timezoneId,
            ignoreHTTPSErrors: flags.ignoreHTTPSErrors,
            projectName: ctx.projectName,
            gitInfos: ctx.gitInfos,
        });
        ctx.analysisId = data.id;
    } catch (error_: unknown) {
        if (!axios.isAxiosError(error_)) {
            throw error_;
        }

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

export default createNewAnalysis;
