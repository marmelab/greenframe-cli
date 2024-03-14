import axios from 'axios';
import { ListrContext, ListrRenderer, ListrTaskWrapper } from 'listr2';
import { getProject } from '../services/api/projects.js';
import ConfigurationError from '../services/errors/ConfigurationError.js';

export default async (
    ctx: ListrContext,
    task: ListrTaskWrapper<unknown, typeof ListrRenderer>
) => {
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
    } catch (error: any) {
        if (!axios.isAxiosError(error)) {
            throw error;
        }

        if (error.response?.status === 404) {
            task.title = `Creating a new project ${projectName}`;
        } else if (error.response?.status === 401) {
            throw new ConfigurationError(
                "Unauthorized access: Check your API TOKEN or your user's subscription."
            );
        }
    }
};
