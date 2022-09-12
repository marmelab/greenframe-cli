import { retrieveGitInformations } from '../services/git';

export default async (ctx: any) => {
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
    } catch (error: any) {
        throw new Error('Failed to retrieve git information.', error);
    }
};
