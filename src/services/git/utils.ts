import { promisify } from 'node:util';
import { exec as execSync } from 'node:child_process';
const exec = promisify(execSync);

export const getCommitMessage = async () => {
    try {
        const { stdout } = await exec('git log -1 --pretty=%B');
        return stdout.trim();
    } catch (error: any) {
        console.warn('getCommitMessage:', error.message);
        return 'defaultAnalyseName';
    }
};

export const getBranchName = async () => {
    const { stdout } = await exec('git branch --show-current');

    return stdout.trim();
};

export const getCommitId = async () => {
    try {
        const { stdout } = await exec('git rev-parse HEAD');
        return stdout.trim();
    } catch (error: any) {
        console.warn('getCommitId:', error.message);
        return 'empty-----------------------------------';
    }
};

export const getDirectCommitAncestor = async () => {
    try {
        const { stdout, stderr } = await exec(`printf $(git rev-parse HEAD^)`);
        if (stderr) {
            throw new Error(stderr);
        }

        return stdout;
    } catch {
        // Return nothing and do not fail the process.
    }
};

export const getCommitAncestorWithDefaultBranch = async (defaultBranch: string) => {
    try {
        const { stdout, stderr } = await exec(
            `printf $(git merge-base origin/${defaultBranch} HEAD)`
        );
        if (stderr) {
            throw new Error(stderr);
        }

        return stdout;
    } catch {
        // Return nothing and do not fail the process.
    }
};
