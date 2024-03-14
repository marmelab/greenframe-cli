jest.mock('node:fs', () => {
    return {
        readFile: jest.fn().mockReturnValue('content file'),
    };
});

import { readFile } from 'node:fs';
jest.mock('node:util', () => ({
    promisify: (cb: CallableFunction) => cb,
}));
import path from 'node:path';
const cwd = process.cwd();
import { readFileToString } from '../readFileToString.js';

describe('#readFileToString', () => {
    test('Should call readFile with correctly resolved scenario path', () => {
        readFileToString('../fakeFolder/.greenframe.yml', 'scenarioFolder/scenario.js');
        expect(readFile).toHaveBeenCalledTimes(1);
        expect(readFile).toHaveBeenCalledWith(
            path.resolve(cwd, '../fakeFolder/scenarioFolder/scenario.js')
        );
    });
});
