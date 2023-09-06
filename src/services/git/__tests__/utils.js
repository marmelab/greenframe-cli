jest.mock('node:child_process', () => ({
    exec: jest.fn(),
}));

jest.mock('node:util', () => ({
    promisify: (cb) => cb,
}));

const { exec } = require('node:child_process');

const {
    getCommitMessage,
    getBranchName,
    getCommitId,
    getDirectCommitAncestor,
    getCommitAncestorWithDefaultBranch,
} = require('../utils');

describe('#getCommitMessage', () => {
    it('Should call exec', async () => {
        exec.mockReturnValue({ stdout: 'COMMIT MESSAGE' });
        const commitMessage = await getCommitMessage();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git log -1 --pretty=%B');
        expect(commitMessage).toBe('COMMIT MESSAGE');
    });
    afterEach(() => {
        exec.mockClear();
    });
});

describe('#getBranchName', () => {
    it('Should call exec', async () => {
        exec.mockReturnValue({ stdout: 'BRANCH NAME' });
        const branchMessage = await getBranchName();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git branch --show-current');
        expect(branchMessage).toBe('BRANCH NAME');
    });
    afterEach(() => {
        exec.mockClear();
    });
});

describe('#getCommitId', () => {
    it('Should call exec', async () => {
        exec.mockReturnValue({ stdout: 'COMMIT ID' });
        const commitMessage = await getCommitId();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git rev-parse HEAD');
        expect(commitMessage).toBe('COMMIT ID');
    });
    afterEach(() => {
        exec.mockClear();
    });
});

describe('#getDirectCommitAncestor', () => {
    it('Should call exec', async () => {
        exec.mockReturnValue({ stdout: 'DIRECT COMMIT ANCESTOR' });
        const commitMessage = await getDirectCommitAncestor();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('printf $(git rev-parse HEAD^)');
        expect(commitMessage).toBe('DIRECT COMMIT ANCESTOR');
    });

    it('Should throw an error because exec print in stderr', async () => {
        exec.mockReturnValue({
            stdout: 'DIRECT COMMIT ANCESTOR',
            stderr: 'SOMETHING WENT WRONG',
        });
        const directCommitAncestor = await getDirectCommitAncestor();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('printf $(git rev-parse HEAD^)');
        expect(directCommitAncestor).toBeUndefined();
    });

    afterEach(() => {
        exec.mockClear();
    });
});

describe('#getCommitAncestorWithDefaultBranch', () => {
    it('Should call exec', async () => {
        exec.mockReturnValue({ stdout: 'COMMIT ANCESTOR' });
        const commitMessage = await getCommitAncestorWithDefaultBranch('mybranch');
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'printf $(git merge-base origin/mybranch HEAD)'
        );
        expect(commitMessage).toBe('COMMIT ANCESTOR');
    });

    it('Should throw an error because exec print in stderr', async () => {
        exec.mockReturnValue({
            stdout: 'COMMIT ANCESTOR',
            stderr: 'SOMETHING WENT WRONG',
        });
        const directCommitAncestor = await getCommitAncestorWithDefaultBranch('mybranch');
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'printf $(git merge-base origin/mybranch HEAD)'
        );
        expect(directCommitAncestor).toBeUndefined();
    });

    afterEach(() => {
        exec.mockClear();
    });
});
