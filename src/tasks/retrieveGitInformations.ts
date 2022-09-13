import { retrieveGitInformations } from '../services/git';
import initDebug from 'debug';

const debug = initDebug('greenframe:tasks:retrieveGitInformations');

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
    } catch {
        debug("The folder is not a git repository, we can't retrieve git informations");
        ctx.gitInfos = {
            commitMessage: `Analysis for ${ctx.args.baseURL}`,
        };
    }
};
