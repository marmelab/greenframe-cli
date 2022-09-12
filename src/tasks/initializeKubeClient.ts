import { initKubeConfig } from '../services/container/kubernetes/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (ctx: any) => {
    const { flags } = ctx;
    await initKubeConfig(flags.kubeConfig);
};
