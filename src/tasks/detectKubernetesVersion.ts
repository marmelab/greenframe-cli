import { TaskWrapper } from 'listr2/dist/lib/task-wrapper';
import { getKubernetesVersion } from '../services/container/kubernetes/client';

import ConfigurationError from '../services/errors/ConfigurationError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (_: any, task: TaskWrapper<unknown, any>) {
    try {
        task.title = await getKubernetesVersion();
    } catch (error) {
        console.error(error);
        throw new ConfigurationError(
            'Kubernetes is not installed or is not accessible on your machine. Check https://docs.greenframe.io for more informations.'
        );
    }
}
