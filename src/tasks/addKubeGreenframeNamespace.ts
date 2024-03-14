import { HttpError } from '@kubernetes/client-node';
import { ListrTaskWrapper } from 'listr2';
import { GREENFRAME_NAMESPACE } from '../constants.js';
import { kubeApi } from '../services/container/kubernetes/client.js';
import ConfigurationError from '../services/errors/ConfigurationError.js';

export const addKubeGreenframeNamespace = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: ListrTaskWrapper<unknown, any>
) => {
    const namespace = {
        metadata: {
            name: GREENFRAME_NAMESPACE,
        },
    };
    try {
        const { body: existingNamespaces } = await kubeApi.listNamespace();
        if (
            existingNamespaces.items.some(
                (namespace) => namespace.metadata?.name === GREENFRAME_NAMESPACE
            )
        ) {
            task.title = 'Greenframe namespace already exists';
            return;
        }

        await kubeApi.createNamespace(namespace);
    } catch (error) {
        throw new ConfigurationError(
            `Error when creating namespace: ${(error as HttpError).body.message}`
        );
    }
};
