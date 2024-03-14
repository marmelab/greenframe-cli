import { Args, Command, Flags } from '@oclif/core';
import path from 'node:path';

import { parseConfigFile, resolveParams } from '../services/parseConfigFile.js';

import executeScenario from '../runner/scenarioWrapper.js';

import { detectExecutablePath } from '../services/detectExecutablePath.js';
class OpenCommand extends Command {
    static args = {
        baseURl: Args.string({
            name: 'baseURL', // name of arg to show in help and reference with args[name]
            description: 'Your baseURL website', // help description
        }),
        scenarios: Args.string({
            name: 'scenarios', // name of arg to show in help and reference with args[name]
            description: 'Path to your GreenFrame scenario', // help description
            required: false,
        }),
    };

    static defaultFlags = {
        configFile: './.greenframe.yml',
        useAdblock: false,
        ignoreHTTPSErrors: false,
    };

    static flags = {
        configFile: Flags.string({
            char: 'C',
            description: 'Path to config file',
            required: false,
        }),
        useAdblock: Flags.boolean({
            char: 'a',
            description: 'Use an adblocker during analysis',
        }),
        ignoreHTTPSErrors: Flags.boolean({
            description: 'Ignore HTTPS errors during analysis',
        }),
        locale: Flags.boolean({
            description: 'Set greenframe browser locale',
        }),
        timezoneId: Flags.boolean({
            description: 'Set greenframe browser timezoneId',
        }),
    };

    async run() {
        const commandParams = await this.parse(OpenCommand);
        const configFilePath =
            commandParams.flags.configFile ?? OpenCommand.defaultFlags.configFile;
        const configFileParams = await parseConfigFile(configFilePath);

        const { args, flags } = resolveParams(
            OpenCommand.defaultFlags,
            configFileParams,
            commandParams
        );

        const executablePath = await detectExecutablePath();

        console.info(`Running ${args.scenarios.length} scenarios...`);
        for (let index = 0; index < args.scenarios.length; index++) {
            const scenario = args.scenarios[index];
            const scenarioPath = path.resolve(scenario.path);
            const scenarioFile = await import(scenarioPath).then(
                (module) => module.default
            );
            try {
                const { timelines } = await executeScenario(scenarioFile, {
                    debug: true,
                    baseUrl: args.baseURL,
                    executablePath,
                    useAdblock: flags.useAdblock,
                    extraHosts: args.extraHosts,
                    ignoreHTTPSErrors: flags.ignoreHTTPSErrors,
                    locale: flags.locale,
                    timezoneId: flags.timezoneId,
                });
                console.info(
                    `✅ ${scenario.name}: ${
                        new Date(timelines.end).getTime() -
                        new Date(timelines.start).getTime()
                    } ms`
                );
            } catch (error: any) {
                console.error(`❌ Error : ${scenario.name}`);
                console.error(error.message);
                process.exit(0);
            }
        }

        console.info(`
GreenFrame scenarios finished successfully !

You can now run an analysis to estimate the consumption of your application.
        `);
    }
}

OpenCommand.description = `Open browser to develop your GreenFrame scenario
...
greenframe analyze ./yourScenario.js https://greenframe.io
`;

export default OpenCommand;
