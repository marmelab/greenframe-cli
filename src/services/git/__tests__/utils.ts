jest.mock('node:child_process', () => ({
    exec: jest.fn(),
}));

jest.mock('node:util', () => ({
    promisify: (cb: CallableFunction) => cb,
}));

import { exec } from 'node:child_process';
import {
    getCommitMessage,
    getBranchName,
    getCommitId,
    getDirectCommitAncestor,
    getCommitAncestorWithDefaultBranch,
} from '../utils.js';

describe('#getCommitMessage', () => {
    it('Should call exec', async () => {
        // @ts-expect-error Jest mock
        exec.mockReturnValue({ stdout: 'COMMIT MESSAGE' });
        const commitMessage = await getCommitMessage();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git log -1 --pretty=%B');
        expect(commitMessage).toBe('COMMIT MESSAGE');
    });
    afterEach(() => {
        // @ts-expect-error Jest mock
        exec.mockClear();
    });
});

describe('#getBranchName', () => {
    it('Should call exec', async () => {
        // @ts-expect-error Jest mock
        exec.mockReturnValue({ stdout: 'BRANCH NAME' });
        const branchMessage = await getBranchName();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git branch --show-current');
        expect(branchMessage).toBe('BRANCH NAME');
    });
    afterEach(() => {
        // @ts-expect-error Jest mock
        exec.mockClear();
    });
});

describe('#getCommitId', () => {
    it('Should call exec', async () => {
        // @ts-expect-error Jest mock
        exec.mockReturnValue({ stdout: 'COMMIT ID' });
        const commitMessage = await getCommitId();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git rev-parse HEAD');
        expect(commitMessage).toBe('COMMIT ID');
    });
    afterEach(() => {
        // @ts-expect-error Jest mock
        exec.mockClear();
    });
});

describe('#getDirectCommitAncestor', () => {
    it('Should call exec', async () => {
        // @ts-expect-error Jest mock
        exec.mockReturnValue({ stdout: 'DIRECT COMMIT ANCESTOR' });
        const commitMessage = await getDirectCommitAncestor();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('printf $(git rev-parse HEAD^)');
        expect(commitMessage).toBe('DIRECT COMMIT ANCESTOR');
    });

    it('Should throw an error because exec print in stderr', async () => {
        // @ts-expect-error Jest mock
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
        // @ts-expect-error Jest mock
        exec.mockClear();
    });
});

describe('#getCommitAncestorWithDefaultBranch', () => {
    it('Should call exec', async () => {
        // @ts-expect-error Jest mock
        exec.mockReturnValue({ stdout: 'COMMIT ANCESTOR' });
        const commitMessage = await getCommitAncestorWithDefaultBranch('mybranch');
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'printf $(git merge-base origin/mybranch HEAD)'
        );
        expect(commitMessage).toBe('COMMIT ANCESTOR');
    });

    it('Should throw an error because exec print in stderr', async () => {
        // @ts-expect-error Jest mock
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
        // @ts-expect-error Jest mock
        exec.mockClear();
    });
});
