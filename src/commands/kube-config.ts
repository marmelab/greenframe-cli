import { Command, Flags } from '@oclif/core';
import { Listr } from 'listr2';
import { parseConfigFile, resolveParams } from '../services/parseConfigFile';
import { addKubeGreenframeDaemonset } from '../tasks/addKubeGreenframeDaemonset';
import { addKubeGreenframeNamespace } from '../tasks/addKubeGreenframeNamespace';
import { deleteKubeGreenframeNamespace } from '../tasks/deleteKubeGreenframeNamespace';
import initializeKubeClient from '../tasks/initializeKubeClient';

class KubeConfigCommand extends Command {
    static args = [];

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
        delete: Flags.boolean({
            char: 'D',
            description: 'Delete daemonset and namespace from kubernetes cluster',
            required: false,
        }),
    };

    static defaultFlags = {
        configFile: './.greenframe.yml',
    };

    async run() {
        const commandParams = await this.parse(KubeConfigCommand);
        const configFilePath =
            commandParams.flags.configFile ?? KubeConfigCommand.defaultFlags.configFile;

        const configFileParams = await parseConfigFile(configFilePath);

        const { flags } = resolveParams(
            KubeConfigCommand.defaultFlags,
            configFileParams,
            commandParams
        );
        if (flags.delete) {
            await new Listr([
                {
                    title: 'Check configuration file',
                    task: async (ctx) => {
                        ctx.flags = flags;
                    },
                },
                {
                    title: 'Initialize kubernetes client',
                    task: initializeKubeClient,
                },
                {
                    title: 'Deleting Greenframe namespace',
                    task: deleteKubeGreenframeNamespace,
                },
            ]).run();
            return;
        }

        const tasks = new Listr([
            {
                title: 'Check configuration file',
                task: async (ctx) => {
                    ctx.flags = flags;
                },
            },
            {
                title: 'Intializing kubernetes client',
                task: initializeKubeClient,
            },
            {
                title: 'Creating greenframe namespace',
                task: addKubeGreenframeNamespace,
            },
            {
                title: 'Creating greenframe daemonset',
                task: addKubeGreenframeDaemonset,
            },
        ]);
        await tasks.run();
        console.info('\nKubernetes configuration complete !\n');
    }
}

KubeConfigCommand.description = `Configure kubernetes cluster to collect greenframe metrics
...
greenframe kube-config
`;

module.exports = KubeConfigCommand;
