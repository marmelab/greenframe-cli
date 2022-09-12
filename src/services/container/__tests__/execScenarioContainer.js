jest.mock('node:child_process', () => ({
    exec: jest.fn(),
}));

jest.mock('node:util', () => ({
    promisify: (cb) => cb,
}));

const { exec } = require('node:child_process');
const {
    createContainer,
    startContainer,
    execScenarioContainer,
    stopContainer,
} = require('../execScenarioContainer');

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
