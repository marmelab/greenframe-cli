import http from 'node:http';
import ConfigurationError from '../errors/ConfigurationError.js';
import initDebug from 'debug';

const debug = initDebug('greenframe:services:contaiener:getContainerStats');

export type DockerdOptions = {
    dockerdHost?: string;
    dockerdPort?: number;
};

type Options = {
    path: string;
    method: string;
    host?: string;
    port?: number;
    socketPath?: string;
};

const getIsContainerRunning = (
    containerName: string,
    dockerdOptions?: DockerdOptions
) => {
    return new Promise<void>((resolve, reject) => {
        const options: Options = {
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
            const callback = (res: http.IncomingMessage) => {
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

const getContainerStats = (containerName: string, dockerdOptions?: DockerdOptions) => {
    const options: Options = {
        path: `/containers/${containerName}/stats`,
        method: 'GET',
    };
    if (dockerdOptions && dockerdOptions.dockerdHost) {
        options.host = dockerdOptions.dockerdHost;
        options.port = dockerdOptions.dockerdPort || 2375;
    } else {
        options.socketPath = '/var/run/docker.sock';
    }

    const stats: string[] = [];
    const callback = (res: http.IncomingMessage) => {
        res.on('data', (data: ArrayBuffer) => {
            try {
                const stat = JSON.parse(Buffer.from(data).toString());
                stats.push(stat);
            } catch {
                // Stream ended, ignoring data
            }
        });

        res.on('error', (e: any) => {
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

const getContainerStatsIfRunning = async (
    containerName: string,
    dockerdOptions?: DockerdOptions
) => {
    try {
        await getIsContainerRunning(containerName, dockerdOptions);
        return getContainerStats(containerName, dockerdOptions);
    } catch (error) {
        if (error instanceof Error) {
            throw new ConfigurationError(error.message);
        }

        if (typeof error === 'string') {
            throw new ConfigurationError(error);
        }

        throw new ConfigurationError('Unknown error');
    }
};

export default getContainerStatsIfRunning;
