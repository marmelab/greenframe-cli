const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const getCommitMessage = async () => {
    try {
        const { stdout } = await exec('git log -1 --pretty=%B');
        return stdout.trim();
    } catch (error) {
        console.warn('getCommitMessage:', error.message);
        return 'defaultAnalyseName';
    }
};

const getBranchName = async () => {
    const { stdout } = await exec('git branch --show-current');

    return stdout.trim();
};

const getCommitId = async () => {
    try {
        const { stdout } = await exec('git rev-parse HEAD');
        return stdout.trim();
    } catch (error) {
        console.warn('getCommitId:', error.message);
        return 'empty-----------------------------------';
    }
};

const getDirectCommitAncestor = async () => {
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

const getCommitAncestorWithDefaultBranch = async (defaultBranch) => {
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

module.exports = {
    getCommitMessage,
    getBranchName,
    getCommitId,
    getDirectCommitAncestor,
    getCommitAncestorWithDefaultBranch,
};
