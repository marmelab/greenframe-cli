const ConfigurationError = require('../services/errors/ConfigurationError');

const { getProject } = require('../services/api/projects');

module.exports = async (ctx, task) => {
    const projectName =
        ctx.flags.projectName ??
        process.env.GREENFRAME_PROJECT_NAME ??
        process.cwd().split('/').slice(-1)[0];

    if (!projectName) {
        throw new ConfigurationError('GreenFrame project name was not found.');
    }

    ctx.projectName = projectName;
    try {
        const { data } = await getProject(projectName);
        ctx.project = data;
    } catch (error) {
        if (error.response?.status === 404) {
            task.title = `Creating a new project ${projectName}`;
        } else if (error.response?.status === 401) {
            throw new ConfigurationError(
                "Unauthorized access: Check your API TOKEN or your user's subscription."
            );
        }
    }
};
