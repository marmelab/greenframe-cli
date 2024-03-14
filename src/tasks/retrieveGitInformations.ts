import { ListrContext, ListrRenderer, ListrTaskWrapper } from 'listr2';
import { retrieveGitInformations } from '../services/git/index.js';

export default async (
    ctx: ListrContext,
    task: ListrTaskWrapper<unknown, typeof ListrRenderer>
) => {
    try {
        const { flags } = ctx;
        ctx.gitInfos = await retrieveGitInformations(
            {
                commitMessage: flags.commitMessage,
                branchName: flags.branchName,
                commitId: flags.commitId,
            },
            ctx.project?.defaultBranch
        );
    } catch {
        task.title = 'The folder is not a git repository';
        ctx.gitInfos = {
            commitMessage: `Analysis for ${ctx.args.baseURL}`,
        };
    }
};
