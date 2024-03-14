import { HttpError } from '@kubernetes/client-node';
import { ListrRenderer, ListrTaskWrapper } from 'listr2';
import { GREENFRAME_NAMESPACE } from '../constants.js';
import { kubeApi } from '../services/container/kubernetes/client.js';
import ConfigurationError from '../services/errors/ConfigurationError.js';

export const deleteKubeGreenframeNamespace = async (
    _: unknown,
    task: ListrTaskWrapper<unknown, typeof ListrRenderer>
) => {
    try {
        const { body: existingNamespaces } = await kubeApi.listNamespace();
        if (
            existingNamespaces.items.some(
                (namespace) => namespace.metadata?.name === GREENFRAME_NAMESPACE
            )
        ) {
            await kubeApi.deleteNamespace(GREENFRAME_NAMESPACE);
            return;
        }

        task.title = 'Greenframe namespace does not exists';
    } catch (error) {
        throw new ConfigurationError(
            `Error when deleting namespace: ${(error as HttpError).body.message}`
        );
    }
};
