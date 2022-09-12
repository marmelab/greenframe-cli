const http = require('node:http');
const ConfigurationError = require('../errors/ConfigurationError');

const getIsContainerRunning = (containerName) => {
    return new Promise((resolve, reject) => {
        const options = {
            socketPath: '/var/run/docker.sock',
            path: `/containers/${containerName}/json`,
            method: 'GET',
        };
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

const getContainerStats = (containerName) => {
    const options = {
        socketPath: '/var/run/docker.sock',
        path: `/containers/${containerName}/stats`,
        method: 'GET',
    };
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

const getContainerStatsIfRunning = async (containerName) => {
    try {
        await getIsContainerRunning(containerName);
        return getContainerStats(containerName);
    } catch {
        throw new ConfigurationError(`${containerName} container is not running.`);
    }
};

module.exports = getContainerStatsIfRunning;
