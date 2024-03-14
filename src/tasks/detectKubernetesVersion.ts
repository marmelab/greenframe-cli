import { ListrRenderer, ListrTaskWrapper } from 'listr2';
import { getKubernetesVersion } from '../services/container/kubernetes/client.js';
import ConfigurationError from '../services/errors/ConfigurationError.js';

export default async function (
    _: unknown,
    task: ListrTaskWrapper<unknown, typeof ListrRenderer>
) {
    try {
        task.title = await getKubernetesVersion();
    } catch (error) {
        console.error(error);
        throw new ConfigurationError(
            'Kubernetes is not installed or is not accessible on your machine. Check https://docs.greenframe.io for more informations.'
        );
    }
}
