import { ListrRenderer, ListrTaskWrapper } from 'listr2';

import { getDockerVersion } from '../services/docker/index.js';
import ConfigurationError from '../services/errors/ConfigurationError.js';

export default async (
    _: unknown,
    task: ListrTaskWrapper<unknown, typeof ListrRenderer>
) => {
    try {
        task.title = await getDockerVersion();
    } catch {
        throw new ConfigurationError(
            'Docker is not installed or is not accessible on your machine. Check https://docs.greenframe.io for more informations.'
        );
    }
};
