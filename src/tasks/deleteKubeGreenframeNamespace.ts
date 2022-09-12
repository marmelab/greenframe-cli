import { HttpError } from '@kubernetes/client-node';
import { TaskWrapper } from 'listr2/dist/lib/task-wrapper';
import { GREENFRAME_NAMESPACE } from '../constants';
import { kubeApi } from '../services/container/kubernetes/client';
import ConfigurationError from '../services/errors/ConfigurationError';

export const deleteKubeGreenframeNamespace = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: TaskWrapper<unknown, any>
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
