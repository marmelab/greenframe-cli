const { getDockerVersion } = require('../services/docker');
const ConfigurationError = require('../services/errors/ConfigurationError');

module.exports = async (_, task) => {
    try {
        task.title = await getDockerVersion();
    } catch {
        throw new ConfigurationError(
            'Docker is not installed or is not accessible on your machine. Check https://docs.greenframe.io for more informations.'
        );
    }
};
