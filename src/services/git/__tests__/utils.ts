import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:child_process')>();
    return {
        ...actual,
        exec: vi.fn(),
    };
});

vi.mock('node:util', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:util')>();
    return {
        ...actual,
        promisify: (cb: CallableFunction) => cb,
    };
});

import { exec } from 'node:child_process';
import {
    getBranchName,
    getCommitAncestorWithDefaultBranch,
    getCommitId,
    getCommitMessage,
    getDirectCommitAncestor,
} from '../utils.js';

describe('#getCommitMessage', () => {
    it('Should call exec', async () => {
        // @ts-expect-error vi mock
        exec.mockReturnValue({ stdout: 'COMMIT MESSAGE' });
        const commitMessage = await getCommitMessage();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git log -1 --pretty=%B');
        expect(commitMessage).toBe('COMMIT MESSAGE');
    });
    afterEach(() => {
        // @ts-expect-error vi mock
        exec.mockClear();
    });
});

describe('#getBranchName', () => {
    it('Should call exec', async () => {
        // @ts-expect-error vi mock
        exec.mockReturnValue({ stdout: 'BRANCH NAME' });
        const branchMessage = await getBranchName();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git branch --show-current');
        expect(branchMessage).toBe('BRANCH NAME');
    });
    afterEach(() => {
        // @ts-expect-error vi mock
        exec.mockClear();
    });
});

describe('#getCommitId', () => {
    it('Should call exec', async () => {
        // @ts-expect-error vi mock
        exec.mockReturnValue({ stdout: 'COMMIT ID' });
        const commitMessage = await getCommitId();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('git rev-parse HEAD');
        expect(commitMessage).toBe('COMMIT ID');
    });
    afterEach(() => {
        // @ts-expect-error vi mock
        exec.mockClear();
    });
});

describe('#getDirectCommitAncestor', () => {
    it('Should call exec', async () => {
        // @ts-expect-error vi mock
        exec.mockReturnValue({ stdout: 'DIRECT COMMIT ANCESTOR' });
        const commitMessage = await getDirectCommitAncestor();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('printf $(git rev-parse HEAD^)');
        expect(commitMessage).toBe('DIRECT COMMIT ANCESTOR');
    });

    it('Should throw an error because exec print in stderr', async () => {
        // @ts-expect-error vi mock
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
        // @ts-expect-error vi mock
        exec.mockClear();
    });
});

describe('#getCommitAncestorWithDefaultBranch', () => {
    it('Should call exec', async () => {
        // @ts-expect-error vi mock
        exec.mockReturnValue({ stdout: 'COMMIT ANCESTOR' });
        const commitMessage = await getCommitAncestorWithDefaultBranch('mybranch');
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'printf $(git merge-base origin/mybranch HEAD)'
        );
        expect(commitMessage).toBe('COMMIT ANCESTOR');
    });

    it('Should throw an error because exec print in stderr', async () => {
        // @ts-expect-error vi mock
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
        // @ts-expect-error vi mock
        exec.mockClear();
    });
});
