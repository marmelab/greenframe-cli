import {
    getCommitMessage,
    getBranchName,
    getCommitId,
    getDirectCommitAncestor,
    getCommitAncestorWithDefaultBranch,
} from './utils.js';

export const retrieveGitInformations = async (
    {
        commitMessage,
        branchName,
        commitId,
    }: {
        commitMessage?: string;
        branchName?: string;
        commitId?: string;
    } = {},
    defaultBranch?: string
) => {
    // If we are on master (default branch), then commit reference is the N-1
    // Else commit reference is the commit origin of the current branch from master
    const defaultBranchCommitReference =
        defaultBranch && branchName !== defaultBranch
            ? await getCommitAncestorWithDefaultBranch(defaultBranch)
            : await getDirectCommitAncestor();

    return {
        commitMessage: commitMessage ?? (await getCommitMessage()),
        branchName: branchName ?? (await getBranchName()),
        commitId: commitId ?? (await getCommitId()),
        defaultBranchCommitReference,
    };
};
