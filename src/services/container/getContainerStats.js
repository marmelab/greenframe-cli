const http = require('node:http');
const ConfigurationError = require('../errors/ConfigurationError');
const initDebug = require('debug');

const debug = initDebug('greenframe:services:contaiener:getContainerStats');

const getIsContainerRunning = (containerName, dockerdOptions) => {
    return new Promise((resolve, reject) => {
        const options = {
            path: `/containers/${containerName}/json`,
            method: 'GET',
        };
        if (dockerdOptions && dockerdOptions.dockerdHost) {
            options.host = dockerdOptions.dockerdHost;
            options.port = dockerdOptions.dockerdPort || 2375;
        } else {
            options.socketPath = '/var/run/docker.sock';
        }

        try {
            const callback = (res) => {
                if (res.statusCode !== 200) {
                    reject(
                        `${containerName} container may has encountered an issue. Status code:${res.statusCode}. Status message:${res.statusMessage}`
                    );
                } else {
                    resolve();
                }
            };

            const clientRequest = http.request(options, callback).on('error', (error) => {
                debug('Error while requesting docker api', error);
                reject(
                    `Could not connect to Docker daemon on ${options.host}:${options.port}`
                );
            });
            clientRequest.end();
        } catch (error) {
            reject(error);
        }
    });
};

const getContainerStats = (containerName, dockerdOptions) => {
    const options = {
        path: `/containers/${containerName}/stats`,
        method: 'GET',
    };
    if (dockerdOptions && dockerdOptions.dockerdHost) {
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
        throw new ConfigurationError(error);
    }
};

module.exports = getContainerStatsIfRunning;
