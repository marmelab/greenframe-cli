const fs = require('node:fs');
const yaml = require('js-yaml');
const util = require('node:util');
const ConfigurationError = require('./errors/ConfigurationError');
const analyze = require('../commands/analyze');
const FILE_NOT_FOUND = 'ENOENT';

const readFile = util.promisify(fs.readFile);

const isMissingDefaultConfigFile = (path, error) => {
    return path === analyze.DEFAULT_CONFIG_FILE && error.code === FILE_NOT_FOUND;
};

const parseConfigFile = async (path) => {
    try {
        const file = await readFile(path, 'utf8');
        let fileContent;

        if (file) {
            fileContent = yaml.load(file);
        }

        if (typeof fileContent !== 'object') {
            throw new yaml.YAMLException(`${path} is not a valid yaml`);
        }

        if (fileContent) {
            const {
                scenario,
                scenarios,
                baseURL,
                samples,
                useAdblock,
                threshold,
                projectName,
                containers,
                databaseContainers,
                kubeContainers,
                kubeDatabaseContainers,
                extraHosts,
                envVar,
                envFile,
                kubeConfig,
                dockerdHost,
                dockerdPort,
                ignoreHTTPSErrors,
                locale,
                timezoneId,
            } = fileContent;

            return {
                args: {
                    scenarios,
                    scenario,
                    baseURL,
                },
                flags: {
                    samples,
                    useAdblock,
                    threshold,
                    projectName,
                    containers,
                    databaseContainers,
                    kubeContainers,
                    kubeDatabaseContainers,
                    extraHosts,
                    envVar,
                    envFile,
                    kubeConfig,
                    dockerdHost,
                    dockerdPort,
                    ignoreHTTPSErrors,
                    locale,
                    timezoneId,
                },
            };
        }
    } catch (error) {
        if (error.name === 'YAMLException') {
            throw new yaml.YAMLException(`${path} is not a valid yaml`);
        } else if (!isMissingDefaultConfigFile(path, error)) {
            throw error;
        }
    }
};

const definedProps = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

const resolveParams = (
    defaultFlags = {},
    configFileParams = { args: {}, flags: {} },
    commandParams = { args: {}, flags: {} }
) => {
    const flags = Object.assign(
        {},
        defaultFlags,
        definedProps(configFileParams.flags),
        definedProps(commandParams.flags)
    );

    const args = Object.assign(
        {},
        definedProps(configFileParams.args),
        definedProps(commandParams.args)
    );

    // Check the baseURL for retrocompatibility ( SCENARIO arg was before BASE_URL arg)
    // If baseURL ends with ".js", it must be the scenario file, so we switch the args
    if (args?.baseURL?.endsWith('.js')) {
        const scenario = args.baseURL;
        args.baseURL = args.scenario;
        args.scenario = scenario;
    }

    if (args.scenario) {
        args.scenarios = [
            {
                path: args.scenario,
                name: 'main scenario',
                threshold: flags.threshold,
            },
        ];
    }

    if (!args.scenarios) {
        args.scenarios = [
            {
                path: '../../src/examples/visit.js',
                name: 'main scenario',
                threshold: flags.threshold,
            },
        ];
    }

    if (!args.baseURL) {
        throw new ConfigurationError('You must provide a "baseURL" argument.');
    }

    return { flags, args };
};

module.exports = { parseConfigFile, resolveParams };
