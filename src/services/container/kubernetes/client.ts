import * as kube from '@kubernetes/client-node';
import axios from 'axios';
import https from 'node:https';

export const kc = new kube.KubeConfig();
export let kubeClient: kube.KubernetesObjectApi;
export let kubeApi: kube.CoreV1Api;
export let exec: kube.Exec;
const opts: https.AgentOptions = {};
let httpsAgent: https.Agent;

export const initKubeConfig = async (configFile?: string) => {
    await (configFile ? kc.loadFromFile(configFile) : kc.loadFromDefault());
    kubeClient = kube.KubernetesObjectApi.makeApiClient(kc);
    kubeApi = kc.makeApiClient(kube.CoreV1Api);
    exec = new kube.Exec(kc);
    await kc.applytoHTTPSOptions(opts);
    httpsAgent = new https.Agent(opts);
};

export const getKubernetesVersion = async () => {
    const currentCluster = kc.getCurrentCluster();
    if (!currentCluster) {
        throw new Error('No kubernetes cluster found, please check your configuration');
    }

    const res = await axios.get<{
        major: string;
        minor: string;
        gitVersion: string;
        gitCommit: string;
        gitTreeState: string;
        buildDate: string;
        goVersion: string;
        compiler: string;
        platform: string;
    }>(`${currentCluster.server}/version?timeout=32s`, {
        ...opts,
        httpsAgent,
    });
    const data = res.data;
    return `Kubernetes version ${data.major}.${data.minor}, build ${data.gitVersion}, platform ${data.platform}`;
};
