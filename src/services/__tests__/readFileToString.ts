import { readFile } from 'node:fs';
import path from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { readFileToString } from '../readFileToString.js';

vi.mock('node:fs', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:fs')>();
    return {
        ...actual,
        readFile: vi.fn().mockReturnValue('content file'),
    };
});

vi.mock('node:util', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:util')>();
    return {
        ...actual,
        promisify: (cb: CallableFunction) => cb,
    };
});

const cwd = process.cwd();

describe('#readFileToString', () => {
    test('Should call readFile with correctly resolved scenario path', () => {
        readFileToString('../fakeFolder/.greenframe.yml', 'scenarioFolder/scenario.js');
        expect(readFile).toHaveBeenCalledTimes(1);
        expect(readFile).toHaveBeenCalledWith(
            path.resolve(cwd, '../fakeFolder/scenarioFolder/scenario.js')
        );
    });
});
