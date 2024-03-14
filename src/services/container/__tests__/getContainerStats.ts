import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:http', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:http')>();
    return {
        ...actual,
        default: {
            ...actual,
            request: vi.fn().mockImplementation((_: any, callback: any) => {
                callback({ statusCode: 200, on: vi.fn() });
                return {
                    on: vi.fn(),
                    write: vi.fn(),
                    end: vi.fn(),
                };
            }),
        },
    };
});

import http from 'node:http';
import getContainerStatsIfRunning from '../getContainerStats.js';

describe('getContainerStats', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
