import { retrieveGitInformations } from '../services/git';

export default async (ctx: any, task: any) => {
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
