import { Command, Flags } from '@oclif/core';
import { Listr } from 'listr2';

import { saveFailedAnalysis } from '../services/api/analyses';

import { parseConfigFile, resolveParams } from '../services/parseConfigFile';

import ERROR_CODES from '../services/errors/errorCodes';
import logErrorOnSentry from '../services/errors/Sentry';

import { DEFAULT_SAMPLES } from '../constants';
export const DEFAULT_CONFIG_FILE = './.greenframe.yml';

import createNewAnalysis from '../tasks/createNewAnalysis';
import detectDockerVersion from '../tasks/detectDockerVersion';
import detectKubernetesVersion from '../tasks/detectKubernetesVersion';
import displayAnalysisResults from '../tasks/displayAnalysisResult';
import executeDistantAnalysis from '../tasks/executeDistantAnalysis';
import initializeKubeClient from '../tasks/initializeKubeClient';
import retrieveGitInformations from '../tasks/retrieveGitInformations';
import retrieveGreenFrameProject from '../tasks/retrieveGreenFrameProject';
import runScenarioAndSaveResults from '../tasks/runScenariosAndSaveResult';
import checkGreenFrameSecretToken from '../tasks/checkGreenFrameSecretToken';
class AnalyzeCommand extends Command {
    static args = [
        {
            name: 'baseURL',
            description: 'Your baseURL website',
        },
        {
            name: 'scenario', // name of arg to show in help and reference with args[name]
            description: 'Path to your GreenFrame scenario', // help description
            required: false,
        },
    ];

    static defaultFlags = {
        configFile: DEFAULT_CONFIG_FILE,
        samples: DEFAULT_SAMPLES,
        useAdblock: false,
        ignoreHTTPSErrors: false,
    };

    static flags = {
        configFile: Flags.string({
            char: 'C',
            description: 'Path to config file',
            required: false,
        }),
        kubeConfig: Flags.string({
            char: 'K',
            description: 'Path to kubernetes client config file',
            required: false,
        }),
        threshold: Flags.string({
            char: 't', // shorter flag version
            description: 'Consumption threshold', // help description for flag
        }),
        projectName: Flags.string({
            char: 'p',
            description: 'Project name',
        }),
        commitMessage: Flags.string({
            char: 'c',
            description: 'Pass commit message manually',
        }),
        commitId: Flags.string({
            description: 'Pass commit id manually', // help description for flag
        }),
        branchName: Flags.string({
            char: 'b',
            description: 'Pass branch name manually',
        }),
        samples: Flags.string({
            char: 's',
            description: 'Number of runs done for the score computation',
        }),
        useAdblock: Flags.boolean({
            char: 'a',
            description: 'Use an adblocker during analysis',
        }),
        ignoreHTTPSErrors: Flags.boolean({
            char: 'i',
            description: 'Ignore HTTPS errors during analysis',
        }),
        locale: Flags.boolean({
            description: 'Set greenframe browser locale',
        }),
        timezoneId: Flags.boolean({
            description: 'Set greenframe browser timezoneId',
        }),
        envVar: Flags.string({
            char: 'e',
            description: 'List of environment vars to read in the scenarios',
            required: false,
            multiple: true,
        }),
        envFile: Flags.string({
            char: 'E',
            description: 'File of environment vars',
            required: false,
        }),
        dockerdHost: Flags.string({
            description: 'Docker daemon host',
        }),
        dockerdPort: Flags.integer({
            description: 'Docker daemon port',
        }),
        containers: Flags.string({
            description: 'Pass containers manually',
        }),
        databaseContainers: Flags.string({
            description: 'Pass database containers manually',
        }),
        kubeContainers: Flags.string({
            description: 'Pass kubebernetes containers manually',
        }),
        kubeDatabaseContainers: Flags.string({
            description: 'Pass kubebernetes database containers manually',
        }),
    };

    async run() {
        let analysisId;
        try {
            const commandParams = await this.parse(AnalyzeCommand);
            const configFilePath =
                commandParams.flags.configFile ?? AnalyzeCommand.defaultFlags.configFile;

            const configFileParams = await parseConfigFile(configFilePath);

            const { args, flags } = resolveParams(
                AnalyzeCommand.defaultFlags,
                configFileParams,
                commandParams
            );

            const isDistant = false;
            const isFree = process.env.GREENFRAME_SECRET_TOKEN == null;
            const tasks = new Listr(
                [
                    {
                        title: 'Check configuration file',
                        task: (ctx) => {
                            ctx.args = args;
                            ctx.flags = flags;
                            ctx.configFilePath = configFilePath;
                            ctx.isFree = isFree;
                        },
                    },
                    {
                        title: 'Check GREENFRAME_SECRET_TOKEN',
                        enabled: () => !isFree,
                        task: checkGreenFrameSecretToken,
                    },
                    {
                        title: 'Retrieving Git information',
                        task: retrieveGitInformations,
                    },
                    {
                        title: 'Retrieving GreenFrame Project',
                        enabled: () => !isFree,
                        task: retrieveGreenFrameProject,
                    },
                    {
                        title: 'Creating new analysis',
                        enabled: () => !isFree,
                        task: async (ctx) => {
                            await createNewAnalysis(ctx);
                            analysisId = ctx.analysisId;
                        },
                    },
                    {
                        title: `Analysis is in progress on GreenFrame Server`,
                        enabled: () => isDistant,
                        task: executeDistantAnalysis,
                    },
                    {
                        title: `Analysis is in progress locally`,
                        enabled: () => !isDistant,
                        task: async (ctx, task) => {
                            const tasksDefinition = [
                                {
                                    title: 'Detect docker version',
                                    task: detectDockerVersion,
                                },
                            ];
                            if (flags.kubeContainers || flags.kubeDatabaseContainers) {
                                tasksDefinition.push(
                                    {
                                        title: 'Initialize Kubernetes client',
                                        task: initializeKubeClient,
                                    },
                                    {
                                        title: 'Detect kubernetes version',
                                        task: detectKubernetesVersion,
                                    }
                                );
                            }

                            tasksDefinition.push({
                                title: `Running ${ctx.args.scenarios.length} scenario(s)...`,
                                task: runScenarioAndSaveResults,
                            });
                            const tasks = task.newListr(tasksDefinition, {
                                rendererOptions: { collapse: false },
                            });
                            return tasks;
                        },
                    },
                ],
                {
                    renderer: process.env.DEBUG ? 'verbose' : 'default',
                }
            );
            const { result } = await tasks.run();
            displayAnalysisResults(result, isFree);
        } catch (error: any) {
            console.error('\n❌ Failed!');
            console.error(error.name);
            console.error(error.response?.data || error.message);
            console.error('\nContact us for support: contact@greenframe.io');
            if (!error.errorCode) {
                logErrorOnSentry(error);
            }

            try {
                if (analysisId) {
                    await saveFailedAnalysis(analysisId, {
                        errorCode: error.errorCode || ERROR_CODES.UNKNOWN_ERROR,
                        errorMessage: error.response?.data || error.message,
                    });
                }
            } finally {
                setTimeout(() => {
                    process.exit(1);
                }, 99);
            }
        }
    }
}

AnalyzeCommand.description = `Create an analysis on GreenFrame server.`;

module.exports = AnalyzeCommand;
