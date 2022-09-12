const util = require('node:util');
const path = require('node:path');
const exec = util.promisify(require('node:child_process').exec);
const { CONTAINER_DEVICE_NAME } = require('../../constants');
const ScenarioError = require('../errors/ScenarioError');
const initDebug = require('debug');

const PROJECT_ROOT = path.resolve(__dirname, '../../../');
const debug = initDebug('greenframe:services:container:execScenarioContainer');

const createContainer = async (extraHosts = []) => {
    const { stdout } = await exec(`${PROJECT_ROOT}/dist/bash/getHostIP.sh`);
    const HOSTIP = stdout;
    const extraHostsFlags = extraHosts
        .map((extraHost) => ` --add-host ${extraHost}:${HOSTIP}`)
        .join('');

    const extraHostsEnv =
        extraHosts.length > 0 ? ` -e EXTRA_HOSTS=${extraHosts.join(',')}` : '';

    debug(`Creating container ${CONTAINER_DEVICE_NAME} with extraHosts: ${extraHosts}`);

    const dockerStatCommand = `docker create --tty --name ${CONTAINER_DEVICE_NAME} --rm -e HOSTIP=${HOSTIP}${extraHostsEnv} --add-host localhost:${HOSTIP} ${extraHostsFlags} mcr.microsoft.com/playwright:v1.25.1-focal`;
    debug(`dockerStatCommand: ${dockerStatCommand}`);
    await exec(dockerStatCommand);
    debug(`Container ${CONTAINER_DEVICE_NAME} created`);

    debug(`Copying greenframe files to container ${CONTAINER_DEVICE_NAME}`);
    // For some reason, mounting the volume when you're doing docker in docker doesn't work, but the copy command does.
    const dockerCopyCommand = `docker cp ${PROJECT_ROOT} ${CONTAINER_DEVICE_NAME}:/greenframe`;
    debug(`dockerCopyCommand: ${dockerCopyCommand}`);
    await exec(dockerCopyCommand);
    debug(`Files copied to container ${CONTAINER_DEVICE_NAME}`);
};

const startContainer = async () => {
    const { stderr } = await exec(`docker start ${CONTAINER_DEVICE_NAME}`);
    if (stderr) {
        throw new Error(stderr);
    }

    return 'OK';
};

const execScenarioContainer = async (scenario, url, { useAdblock } = {}) => {
    try {
        let command = `docker exec ${CONTAINER_DEVICE_NAME} node /greenframe/dist/runner/index.js --scenario="${encodeURIComponent(
            scenario
        )}" --url="${encodeURIComponent(url)}"`;

        if (useAdblock) {
            command += ` --useAdblock`;
        }

        const { stdout, stderr } = await exec(command);

        if (stderr) {
            throw new Error(stderr);
        }

        const timelines = JSON.parse(stdout.split('=====TIMELINES=====')[1]);
        const milestones = JSON.parse(stdout.split('=====MILESTONES=====')[1] || '[]');

        return { timelines, milestones };
    } catch (error) {
        throw new ScenarioError(error.stderr || error.message);
    }
};

const stopContainer = async () => {
    try {
        // The container might take a while to stop.
        // We rename it to avoid conflicts when recreating it (if it is still removing while we try to create it again, it will fail).
        await exec(
            `docker rename ${CONTAINER_DEVICE_NAME} ${CONTAINER_DEVICE_NAME}-stopping && docker stop ${CONTAINER_DEVICE_NAME}-stopping`
        );
    } catch {
        // Avoid Throwing error.
        // If container is not running this command throw an error.
        return false;
    }

    return 'OK';
};

module.exports = {
    createContainer,
    startContainer,
    execScenarioContainer,
    stopContainer,
};
