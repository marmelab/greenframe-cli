jest.mock('node:fs', () => {
    return {
        readFile: jest.fn().mockReturnValue('content file'),
    };
});

const { readFile } = require('node:fs');
jest.mock('node:util', () => ({
    promisify: (cb) => cb,
}));
const path = require('node:path');
const cwd = process.cwd();
const { readFileToString } = require('../readFileToString');

describe('#readFileToString', () => {
    test('Should call readFile with correctly resolved scenario path', () => {
        readFileToString('../fakeFolder/.greenframe.yml', 'scenarioFolder/scenario.js');
        expect(readFile).toHaveBeenCalledTimes(1);
        expect(readFile).toHaveBeenCalledWith(
            path.resolve(cwd, '../fakeFolder/scenarioFolder/scenario.js')
        );
    });
});
