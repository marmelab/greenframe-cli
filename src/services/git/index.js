const {
    getCommitMessage,
    getBranchName,
    getCommitId,
    getDirectCommitAncestor,
    getCommitAncestorWithDefaultBranch,
} = require('./utils');

const retrieveGitInformations = async (
    { commitMessage, branchName, commitId } = {},
    defaultBranch
) => {
    // If we are on master (default branch), then commit reference is the N-1
    // Else commit reference is the commit origin of the current branch from master
    const defaultBranchCommitReference =
        defaultBranch && branchName !== defaultBranch
            ? await getCommitAncestorWithDefaultBranch(defaultBranch)
            : await getDirectCommitAncestor();

    let gitInfos = {
        commitMessage: commitMessage ?? (await getCommitMessage()),
        branchName: branchName ?? (await getBranchName()),
        commitId: commitId ?? (await getCommitId()),
        defaultBranchCommitReference,
    };

    return gitInfos;
};

module.exports = {
    retrieveGitInformations,
};
