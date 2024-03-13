jest.mock('node:child_process', () => ({
    exec: jest.fn(),
}));

jest.mock('node:util', () => ({
    promisify: (cb) => cb,
}));

const { exec } = require('node:child_process');
const {
    buildEnvVarList,
    createContainer,
    startContainer,
    execScenarioContainer,
    stopContainer,
} = require('../execScenarioContainer');

describe('#buildEnvVarList', () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...env };
    });

    it('Should return empty string when no params', () => {
        const envString = buildEnvVarList();
        expect(envString).toBe('');
    });

    it('Should return empty string with empty params', async () => {
        const envVars = [];
        const envFile = '';
        const envString = buildEnvVarList(envVars, envFile);
        expect(envString).toBe('');
    });

    it('Should return correct string with only envVars names', async () => {
        process.env.VAR_ONE = 'one';
        process.env.VAR_TWO = 'two';
        const envVars = ['VAR_ONE', 'VAR_TWO'];
        const envFile = '';
        const envString = buildEnvVarList(envVars, envFile);
        expect(envString).toBe(' -e VAR_ONE=one -e VAR_TWO=two');
    });

    it('Should return correct string with only envVars names and values', async () => {
        const envVars = ['VAR_ONE=one', 'VAR_TWO=two'];
        const envFile = '';
        const envString = buildEnvVarList(envVars, envFile);
        expect(envString).toBe(' -e VAR_ONE=one -e VAR_TWO=two');
    });

    it('Should return correct string with only envFile', async () => {
        const envVars = [];
        const envFile = './.env.local';
        const envString = buildEnvVarList(envVars, envFile);
        expect(envString).toBe(' --env-file ./.env.local');
    });

    it('Should return correct string with both envVars and envFile', async () => {
        process.env.VAR_ONE = 'one';
        const envVars = ['VAR_ONE', 'VAR_TWO=two'];
        const envFile = './.env.local';
        const envString = buildEnvVarList(envVars, envFile);
        expect(envString).toBe(' -e VAR_ONE=one -e VAR_TWO=two --env-file ./.env.local');
    });

    afterEach(() => {
        process.env = env;
    });
});

describe('#createContainer', () => {
    it('Should call exec with good command', async () => {
        exec.mockReturnValueOnce({ stdout: 'HOST_IP' });
        await createContainer();
        expect(exec).toHaveBeenCalledTimes(3);
        expect(exec.mock.calls[1][0]).toContain(
            'docker create --tty --name greenframe-runner --rm -e HOSTIP=HOST_IP --add-host localhost:HOST_IP'
        );
    });

    it('Should call exec with extraHosts', async () => {
        exec.mockReturnValueOnce({ stdout: 'HOST_IP' });
        await createContainer(['example.com', 'another-example.com']);
        expect(exec).toHaveBeenCalledTimes(3);
        expect(exec.mock.calls[1][0]).toContain(
            'docker create --tty --name greenframe-runner --rm -e HOSTIP=HOST_IP -e EXTRA_HOSTS=example.com,another-example.com --add-host localhost:HOST_IP  --add-host example.com:HOST_IP --add-host another-example.com:HOST_IP'
        );
    });

    it('Should call exec with env vars', async () => {
        exec.mockReturnValueOnce({ stdout: 'HOST_IP' });
        await createContainer([], ['VAR_ONE=one', 'VAR_TWO=two']);
        expect(exec).toHaveBeenCalledTimes(3);
        expect(exec.mock.calls[1][0]).toContain(
            'docker create --tty --name greenframe-runner --rm -e HOSTIP=HOST_IP -e VAR_ONE=one -e VAR_TWO=two '
        );
    });

    it('Should call exec with env file', async () => {
        exec.mockReturnValueOnce({ stdout: 'HOST_IP' });
        await createContainer([], [], './.env.local');
        expect(exec).toHaveBeenCalledTimes(3);
        expect(exec.mock.calls[1][0]).toContain(
            'docker create --tty --name greenframe-runner --rm -e HOSTIP=HOST_IP --env-file ./.env.local '
        );
    });

    afterEach(() => {
        exec.mockClear();
    });
});

describe('#startContainer', () => {
    it('Should call exec with good command', async () => {
        exec.mockReturnValue({});

        await startContainer();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith('docker start greenframe-runner');
    });

    it('Should throw an error', async () => {
        exec.mockReturnValue({ stderr: 'TEST ERROR' });

        await expect(startContainer()).rejects.toThrow('TEST ERROR');
    });
    afterEach(() => {
        exec.mockClear();
    });
});

describe('#execScenarioContainer', () => {
    it('Should call exec with good command and return timelines', async () => {
        exec.mockReturnValue({
            stdout: `=====TIMELINES=====
{"start": "START_DATE", "end": "END_DATE", "elapsed": "ELAPSED_TIME"}
=====TIMELINES=====
            `,
        });

        const result = await execScenarioContainer(
            'path_to_scenario',
            'http://example.com'
        );
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'docker exec greenframe-runner node /greenframe/dist/runner/index.js --scenario="path_to_scenario" --url="http%3A%2F%2Fexample.com"'
        );

        expect(result).toEqual({
            milestones: [],
            timelines: {
                start: 'START_DATE',
                end: 'END_DATE',
                elapsed: 'ELAPSED_TIME',
            },
        });
    });

    it('Should call exec with good command and also return milestones if provided', async () => {
        exec.mockReturnValue({
            stdout: `=====TIMELINES=====
{"start": "START_DATE", "end": "END_DATE", "elapsed": "ELAPSED_TIME"}
=====TIMELINES=====
=====MILESTONES=====
[{"title": "TITLE", "time": "TIME"}]
=====MILESTONES=====
            `,
        });

        const result = await execScenarioContainer(
            'path_to_scenario',
            'http://example.com'
        );
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'docker exec greenframe-runner node /greenframe/dist/runner/index.js --scenario="path_to_scenario" --url="http%3A%2F%2Fexample.com"'
        );

        expect(result).toEqual({
            milestones: [{ title: 'TITLE', time: 'TIME' }],
            timelines: {
                start: 'START_DATE',
                end: 'END_DATE',
                elapsed: 'ELAPSED_TIME',
            },
        });
    });

    it('Should call exec with useAdblocker', async () => {
        exec.mockReturnValue({
            stdout: `=====TIMELINES=====
{"start": "START_DATE", "end": "END_DATE", "elapsed": "ELAPSED_TIME"}
=====TIMELINES=====
=====MILESTONES=====
[{"title": "TITLE", "time": "TIME"}]
=====MILESTONES=====
            `,
        });

        const result = await execScenarioContainer(
            'path_to_scenario',
            'http://example.com',
            { useAdblock: true }
        );
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'docker exec greenframe-runner node /greenframe/dist/runner/index.js --scenario="path_to_scenario" --url="http%3A%2F%2Fexample.com" --useAdblock'
        );

        expect(result).toEqual({
            milestones: [{ title: 'TITLE', time: 'TIME' }],
            timelines: {
                start: 'START_DATE',
                end: 'END_DATE',
                elapsed: 'ELAPSED_TIME',
            },
        });
    });

    it('Should throw an error because exec throw an error', async () => {
        exec.mockReturnValue({
            stdout: `=====TIMELINES=====
                    {"start": "START_DATE", "end": "END_DATE", "elapsed": "ELAPSED_TIME"}
                    =====TIMELINES=====
            `,
            stderr: 'TEST ERROR',
        });

        await expect(
            execScenarioContainer('path_to_scenario', 'http://example.com')
        ).rejects.toThrow('TEST ERROR');
    });

    it('Should throw an error because JSON.parse thrown an error', async () => {
        exec.mockReturnValue({
            stdout: `=====TIMELINES=====
                    INVALID JSON
                    =====TIMELINES=====
            `,
        });

        await expect(
            execScenarioContainer('path_to_scenario', 'http://example.com')
        ).rejects.toThrow('Unexpected token I in JSON at position 21');
    });

    afterEach(() => {
        exec.mockClear();
    });
});

describe('#stopContainer', () => {
    it('Should call exec with good command', async () => {
        exec.mockReturnValue({});

        await stopContainer();
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith(
            'docker rename greenframe-runner greenframe-runner-stopping && docker stop greenframe-runner-stopping'
        );
    });

    afterEach(() => {
        exec.mockClear();
    });
});
