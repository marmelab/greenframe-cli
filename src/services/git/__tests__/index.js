jest.mock('../utils');
const {
    getCommitMessage,
    getBranchName,
    getCommitId,
    getCommitAncestorWithDefaultBranch,
} = require('../utils');

const { retrieveGitInformations } = require('../index');

describe('#retrieveGitInformations', () => {
    beforeEach(() => {
        getCommitMessage.mockResolvedValue('DEFAULT COMMIT MESSAGE');
        getBranchName.mockResolvedValue('default_branch_name');
        getCommitId.mockResolvedValue('default-commit-id');
        getCommitAncestorWithDefaultBranch.mockResolvedValue('default-branch-commit-id');
    });

    it('Should correctly retrieve commitMessage', async () => {
        const gitInfos = await retrieveGitInformations();
        expect(getCommitMessage).toHaveBeenCalled();
        expect(gitInfos.commitMessage).toBe('DEFAULT COMMIT MESSAGE');
    });

    it('Should correctly set commitMessage by default', async () => {
        const gitInfos = await retrieveGitInformations({
            commitMessage: 'CUSTOM COMMIT MESSAGE',
        });

        expect(getCommitMessage).not.toHaveBeenCalled();
        expect(gitInfos.commitMessage).toBe('CUSTOM COMMIT MESSAGE');
    });

    it('Should correctly retrieve branchName', async () => {
        const gitInfos = await retrieveGitInformations();
        expect(getBranchName).toHaveBeenCalled();
        expect(gitInfos.branchName).toBe('default_branch_name');
    });

    it('Should correctly set branchName by default', async () => {
        const gitInfos = await retrieveGitInformations({
            branchName: 'custom_branch_name',
        });

        expect(getBranchName).not.toHaveBeenCalled();
        expect(gitInfos.branchName).toBe('custom_branch_name');
    });

    it('Should correctly retrieve commitId', async () => {
        const gitInfos = await retrieveGitInformations();
        expect(getCommitId).toHaveBeenCalled();
        expect(gitInfos.commitId).toBe('default-commit-id');
    });

    it('Should correctly set commitId by default', async () => {
        const gitInfos = await retrieveGitInformations({
            commitId: 'custom-commit-id',
        });

        expect(getCommitId).not.toHaveBeenCalled();
        expect(gitInfos.commitId).toBe('custom-commit-id');
    });

    it('Should correctly retrieve defaultBranchCommitReference', async () => {
        const gitInfos = await retrieveGitInformations();
        expect(getCommitAncestorWithDefaultBranch).not.toHaveBeenCalled();
        expect(gitInfos.defaultBranchCommitReference).toBeUndefined();
    });

    it('Should not retrieve defaultBranchCommitReference', async () => {
        const gitInfos = await retrieveGitInformations({}, 'default_branch');
        expect(getCommitAncestorWithDefaultBranch).toHaveBeenCalled();

        expect(gitInfos.defaultBranchCommitReference).toBe('default-branch-commit-id');
    });

    afterEach(() => {
        getCommitMessage.mockReset();
        getBranchName.mockReset();
        getCommitId.mockReset();
        getCommitAncestorWithDefaultBranch.mockReset();
    });
});
