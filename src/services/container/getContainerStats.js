const http = require('node:http');
const ConfigurationError = require('../errors/ConfigurationError');

const getIsContainerRunning = (containerName, dockerdOptions) => {
    return new Promise((resolve, reject) => {
        const options = {
            path: `/containers/${containerName}/json`,
            method: 'GET',
        };
        if (dockerdOptions.dockerdHost) {
            options.host = dockerdOptions.dockerdHost;
            options.port = dockerdOptions.dockerdPort || 2375;
        } else {
            options.socketPath = '/var/run/docker.sock';
        }

        try {
            const callback = (res) => {
                if (res.statusCode !== 200) {
                    console.info(`\n${containerName} container is not running.`);
                    reject(`${containerName} container is not running.`);
                } else {
                    resolve();
                }
            };

            const clientRequest = http.request(options, callback);
            clientRequest.end();
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

const getContainerStats = (containerName, dockerdOptions) => {
    const options = {
        path: `/containers/${containerName}/stats`,
        method: 'GET',
    };
    if (dockerdOptions.dockerdHost) {
        options.host = dockerdOptions.dockerdHost;
        options.port = dockerdOptions.dockerdPort || 2375;
    } else {
        options.socketPath = '/var/run/docker.sock';
    }
    const stats = [];
    const callback = (res) => {
        res.on('data', (data) => {
            try {
                const stat = JSON.parse(Buffer.from(data).toString());
                stats.push(stat);
            } catch {
                // Stream ended, ignoring data
            }
        });

        res.on('error', (e) => {
            // This code is fired when we call clientRequest.destroy();
            if (e.code !== 'ECONNRESET') {
                console.error(e);
            }
        });
    };

    const clientRequest = http.request(options, callback);
    clientRequest.end();

    const stopContainerStats = () => {
        clientRequest.destroy();
        return stats;
    };

    return stopContainerStats;
};

const getContainerStatsIfRunning = async (containerName, dockerdOptions) => {
    try {
        await getIsContainerRunning(containerName, dockerdOptions);
        return getContainerStats(containerName, dockerdOptions);
    } catch (error) {
        console.log(error);
        throw new ConfigurationError(`${containerName} container is not running.`);
    }
};

module.exports = getContainerStatsIfRunning;
