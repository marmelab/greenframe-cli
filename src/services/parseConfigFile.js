const fs = require('node:fs');
const yaml = require('js-yaml');
const util = require('node:util');
const ConfigurationError = require('./errors/ConfigurationError');

const readFile = util.promisify(fs.readFile);

const parseConfigFile = async (path) => {
    try {
        const file = await readFile(path, 'utf8');
        if (file) {
            const {
                scenario,
                scenarios,
                baseURL,
                samples,
                distant,
                useAdblock,
                threshold,
                projectName,
                containers,
                databaseContainers,
                kubeContainers,
                kubeDatabaseContainers,
                extraHosts,
                kubeConfig,
                dockerdHost,
                dockerdPort,
                ignoreHTTPSErrors,
                locale,
                timezoneId,
            } = yaml.load(file);
            return {
                args: {
                    scenarios,
                    scenario,
                    baseURL,
                },
                flags: {
                    samples,
                    distant,
                    useAdblock,
                    threshold,
                    projectName,
                    containers,
                    databaseContainers,
                    kubeContainers,
                    kubeDatabaseContainers,
                    extraHosts,
                    kubeConfig,
                    dockerdHost,
                    dockerdPort,
                    ignoreHTTPSErrors,
                    locale,
                    timezoneId,
                },
            };
        }
    } catch {
        // Do Nothing
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
                path: './src/examples/visit.js',
                name: 'main scenario',
                threshold: flags.threshold,
            },
        ];
    }

    if (!args.baseURL) {
        throw new ConfigurationError('You must provide a "baseURL" argument.');
    }

    if (flags.free && flags.distant) {
        throw new ConfigurationError(
            'You cannot use both "free" and "distant" flags at the same time.'
        );
    }

    if (
        Boolean(flags.distant) &&
        (flags.containers ||
            flags.databaseContainers ||
            flags.kubeContainers ||
            flags.kubeDatabaseContainers)
    ) {
        throw new ConfigurationError(
            '"distant" mode is incompatible with parameters "containers" or "databaseContainers" or "kubeContainers" or "kubeDatabaseContainers".'
        );
    }

    return { flags, args };
};

module.exports = { parseConfigFile, resolveParams };
