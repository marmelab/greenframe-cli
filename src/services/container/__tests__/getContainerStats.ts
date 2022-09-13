jest.mock('node:http', () => ({
    request: jest
        .fn()
        .mockImplementation(
            (
                _: unknown,
                callback: (res: { statusCode: number; on: (data: any) => void }) => void
            ) => {
                callback({ statusCode: 200, on: jest.fn() });
                return {
                    on: jest.fn(),
                    write: jest.fn(),
                    end: jest.fn(),
                };
            }
        ),
}));

import http from 'node:http';
import getContainerStatsIfRunning from '../getContainerStats';

describe('getContainerStats', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should use the dockerd options if given', async () => {
        await getContainerStatsIfRunning('containerId', {
            dockerdHost: 'localhost',
            dockerdPort: 1234,
        });
        expect(http.request).toHaveBeenCalledTimes(2);
        expect(http.request).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                host: 'localhost',
                port: 1234,
                path: '/containers/containerId/json',
            }),
            expect.any(Function)
        );
        expect(http.request).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                host: 'localhost',
                port: 1234,
                path: '/containers/containerId/stats',
            }),
            expect.any(Function)
        );
    });
    it('should use default socket if no dockerd options given', async () => {
        await getContainerStatsIfRunning('containerId');
        expect(http.request).toHaveBeenCalledTimes(2);
        expect(http.request).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                socketPath: '/var/run/docker.sock',
                path: '/containers/containerId/json',
            }),
            expect.any(Function)
        );
        expect(http.request).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                socketPath: '/var/run/docker.sock',
                path: '/containers/containerId/stats',
            }),
            expect.any(Function)
        );
    });
});
