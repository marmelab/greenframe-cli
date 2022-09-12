import * as kube from '@kubernetes/client-node';
import { kubeApi } from './client';

export const getPodsByLabel = async (label: string, namespace = 'default') => {
    const response = await kubeApi.listNamespacedPod(
        namespace,
        undefined,
        false,
        undefined,
        undefined,
        label
    );
    return response.body.items;
};

export const getNodeName = (pod: kube.V1Pod): string => {
    const node = pod.spec?.nodeName;
    if (!node) {
        throw new Error('Cannot find node for pod');
    }

    return node;
};

export const getPodName = (pod: kube.V1Pod): string => {
    const name = pod.metadata?.name;
    if (!name) {
        throw new Error('Cannot find name for pod');
    }

    return name;
};
