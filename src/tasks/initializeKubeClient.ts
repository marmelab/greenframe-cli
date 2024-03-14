import { ListrContext } from 'listr2';
import { initKubeConfig } from '../services/container/kubernetes/client.js';

export default async (ctx: ListrContext) => {
    const { flags } = ctx;
    await initKubeConfig(flags.kubeConfig);
};
