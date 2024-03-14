import initDebug from 'debug';
import { exec as execSync } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { CONTAINER_DEVICE_NAME } from '../../constants.js';
import ScenarioError from '../errors/ScenarioError.js';
const exec = promisify(execSync);
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_ROOT = path.resolve(__dirname, '../../../');
const debug = initDebug('greenframe:services:container:execScenarioContainer');

export const createContainer = async (
    extraHosts: string[] = [],
    envVars: string[] = [],
    envFile = ''
) => {
    const { stdout } = await exec(`${PROJECT_ROOT}/dist/bash/getHostIP.sh`);
    const HOSTIP = stdout;
    const extraHostsFlags = extraHosts
        .map((extraHost) => ` --add-host ${extraHost}:${HOSTIP}`)
        .join('');

    const extraHostsEnv =
        extraHosts.length > 0 ? ` -e EXTRA_HOSTS=${extraHosts.join(',')}` : '';

    const envString = buildEnvVarList(envVars, envFile);

    debug(`Creating container ${CONTAINER_DEVICE_NAME} with extraHosts: ${extraHosts}`);

    const dockerCleanPreviousCommand = `docker rm -f ${CONTAINER_DEVICE_NAME}`;
    const allEnvVars = ` -e HOSTIP=${HOSTIP}${extraHostsEnv}${envString}`;
    const volumeString = '-v "$(pwd)":/scenarios';
    const dockerCreateCommand = `docker create --tty --name ${CONTAINER_DEVICE_NAME} --rm${allEnvVars} --add-host localhost:${HOSTIP} ${extraHostsFlags} ${volumeString} mcr.microsoft.com/playwright:v1.30.0-focal`;

    const dockerStatCommand = `${dockerCleanPreviousCommand} &&  ${dockerCreateCommand}`;
    debug(`Docker command: ${dockerStatCommand}`);
    await exec(dockerStatCommand);

    debug(`Container ${CONTAINER_DEVICE_NAME} created`);

    debug(`Copying greenframe files to container ${CONTAINER_DEVICE_NAME}`);
    // For some reason, mounting the volume when you're doing docker in docker doesn't work, but the copy command does.
    const dockerCopyCommand = `docker cp ${PROJECT_ROOT} ${CONTAINER_DEVICE_NAME}:/greenframe`;
    await exec(dockerCopyCommand);
    debug(`Files copied to container ${CONTAINER_DEVICE_NAME}`);
};

export const startContainer = async () => {
    const { stderr } = await exec(`docker start ${CONTAINER_DEVICE_NAME}`);
    if (stderr) {
        throw new Error(stderr);
    }

    return 'OK';
};

export const execScenarioContainer = async (
    scenario: string,
    url: string,
    {
        useAdblock,
        ignoreHTTPSErrors,
        locale,
        timezoneId,
    }: {
        useAdblock?: boolean;
        ignoreHTTPSErrors?: boolean;
        locale?: string;
        timezoneId?: string;
    } = {}
) => {
    try {
        let command = `docker exec ${CONTAINER_DEVICE_NAME} node /greenframe/dist/runner/index.js --scenario="${encodeURIComponent(
            scenario
        )}" --url="${encodeURIComponent(url)}"`;

        if (useAdblock) {
            command += ` --useAdblock`;
        }

        if (ignoreHTTPSErrors) {
            command += ` --ignoreHTTPSErrors`;
        }

        if (locale) {
            command += ` --locale=${locale}`;
        }

        if (timezoneId) {
            command += ` --timezoneId=${timezoneId}`;
        }

        const { stdout, stderr } = await exec(command);

        if (stderr) {
            throw new Error(stderr);
        }

        const timelines = JSON.parse(stdout.split('=====TIMELINES=====')[1]);
        const milestones = JSON.parse(stdout.split('=====MILESTONES=====')[1] || '[]');

        return { timelines, milestones };
    } catch (error: any) {
        throw new ScenarioError(error.stderr || error.message);
    }
};

export const stopContainer = async () => {
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

export const buildEnvVarList = (envVars: string[] = [], envFile = '') => {
    const envVarString =
        envVars.length > 0
            ? envVars.reduce((list, envVarName) => {
                  if (envVarName.includes('=')) {
                      return `${list} -e ${envVarName}`;
                  }

                  const envVarValue = process.env[envVarName];
                  return `${list} -e ${envVarName}=${envVarValue}`;
              }, '')
            : '';

    const envVarFileString = envFile ? ` --env-file ${envFile}` : '';

    return `${envVarString}${envVarFileString ? envVarFileString : ''}`;
};
