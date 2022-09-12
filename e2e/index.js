/* eslint-disable jest/no-conditional-expect */
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const BASE_COMMAND = `GREENFRAME_SECRET_TOKEN=API_TOKEN API_URL=http://localhost:3006 ./bin/run analyze`;

describe('E2E: analyze command locally', () => {
    describe('With docker', () => {
        it('E2E: Should run an analysis command correctly on greenframe.io', async () => {
            const { error, stdout } = await exec(
                `${BASE_COMMAND} -C ./.greenframe.e2e.yml`
            );

            expect(stdout).toContain('✅ main scenario completed');
            expect(stdout).toContain('The estimated footprint is');
            expect(stdout).toContain('Check the details of your analysis at');
            expect(error).toBeUndefined();
        });

        it('E2E: Should run an analysis and fail because account is suspended', async () => {
            expect.assertions(3);
            try {
                await exec(
                    `GREENFRAME_SECRET_TOKEN=API_TOKEN_SUSPENDED API_URL=http://localhost:3006 ./bin/run analyze  -C ./.greenframe.e2e.yml -s 2`
                );
            } catch (error) {
                expect(error.stderr).toContain('❌ Failed!');
                expect(error.stderr).toContain('ConfigurationError');
                expect(error.stderr).toContain(
                    "Unauthorized access: Check your API TOKEN or your user's subscription."
                );
            }
        });

        it('E2E: Should run an analysis command below a threshold on greenframe.io', async () => {
            const { error, stdout } = await exec(
                `${BASE_COMMAND} -C ./.greenframe.e2e.yml -t 0.1`
            );
            expect(stdout).toContain('✅ main scenario completed');
            expect(stdout).toContain('The estimated footprint at');
            expect(stdout).toContain('is under the limit configured at 0.1 g eq. co2.');
            expect(stdout).toContain('Check the details of your analysis at');
            expect(error).toBeUndefined();
        });

        it('E2E: Should run an analysis command with adblocker', async () => {
            const { error, stdout } = await exec(
                `${BASE_COMMAND} -C ./.greenframe.e2e.adblock.yml`
            );
            expect(stdout).toContain('✅ main scenario completed');
            expect(stdout).toContain('The estimated footprint is');
            expect(stdout).toContain('Check the details of your analysis at');
            expect(error).toBeUndefined();
        });

        it('E2E: Should run an analysis and fail with higher measure than threshold on greenframe.io', async () => {
            expect.assertions(3);
            try {
                await exec(`${BASE_COMMAND}  -C ./.greenframe.e2e.yml -s 2 -t 0.001`);
            } catch (error) {
                expect(error.stderr).toContain('❌ main scenario failed');
                expect(error.stderr).toContain('The estimated footprint at');
                expect(error.stderr).toContain(
                    'passes the limit configured at 0.001 g eq. co2.'
                );
            }
        });

        it('E2E: Should run an analysis with multiple scenario', async () => {
            const { error, stdout } = await exec(
                `${BASE_COMMAND} -C ./.greenframe.e2e.multiple.yml`
            );
            expect(stdout).toContain('✅ Scenario 1 completed');
            expect(stdout).toContain('is under the limit configured at 0.1 g eq. co2.');
            expect(stdout).toContain('✅ Scenario 2 completed');
            expect(stdout).toContain('is under the limit configured at 0.05 g eq. co2.');
            expect(error).toBeUndefined();
        });

        it('E2E: Should fail because "container_broken" is not a running container', async () => {
            expect.assertions(2);
            try {
                await exec(`${BASE_COMMAND} -C ./.greenframe.e2e.broken.yml`);
            } catch (error) {
                expect(error.stderr).toContain('❌ Failed!');
                expect(error.stderr).toContain(
                    'container_broken container is not running.'
                );
            }
        });

        it('E2E: Should fail because user has reached the project limit', async () => {
            expect.assertions(2);
            try {
                await exec(`${BASE_COMMAND} -C ./.greenframe.e2e.yml -p NewProject`);
            } catch (error) {
                expect(error.stderr).toContain('❌ Failed!');
                expect(error.stderr).toContain(
                    "Unauthorized access: You have reached your project's limit."
                );
            }
        });

        it('E2E: Should run default analysis command correctly on greenframe.io with empty scenerio', async () => {
            const { error, stdout } = await exec(
                `${BASE_COMMAND} -C ./.greenframe.e2e.emptyScenario.yml`
            );

            expect(stdout).toContain('✅ main scenario completed');
            expect(stdout).toContain('The estimated footprint is');
            expect(stdout).toContain('Check the details of your analysis at');
            expect(error).toBeUndefined();
        });
    });
    describe('With kubernetes', () => {
        it.skip('E2E: Should run an analysis command correctly on greenframe.io', async () => {
            const { error, stdout } = await exec(
                `${BASE_COMMAND} -C ./.greenframe.k8s.e2e.yml`
            );

            expect(stdout).toContain('✅ main scenario completed');
            expect(stdout).toContain('The estimated footprint is');
            expect(stdout).toContain('Check the details of your analysis at');
            expect(error).toBeUndefined();
        });
    });
});

describe('E2E: analyze command distant', () => {
    it('E2E: Should fail because distant mode is not compatible with multi containers', async () => {
        expect.assertions(2);
        try {
            await exec(`${BASE_COMMAND} -C ./.greenframe.e2e.yml -d -s 2`);
        } catch (error) {
            expect(error.stderr).toContain('❌ Failed!');
            expect(error.stderr).toContain(
                '"distant" mode is incompatible with parameters "containers" or "databaseContainers"'
            );
        }
    });

    it('E2E: Should run an analysis command correctly on greenframe.io', async () => {
        const { error, stdout } = await exec(
            `${BASE_COMMAND} ./src/examples/greenframe.js https://greenframe.io -p GreenFrame -d -s 2`
        );

        expect(stdout).toContain('✅ main scenario completed');
        expect(stdout).toContain('The estimated footprint is');
        expect(stdout).toContain('Check the details of your analysis at');
        expect(error).toBeUndefined();
    });

    it('E2E: Should run an analysis command below a threshold on greenframe.io', async () => {
        const { error, stdout } = await exec(
            `${BASE_COMMAND} ./src/examples/greenframe.js https://greenframe.io -s 2 -p GreenFrame -d -t 0.1`
        );
        expect(stdout).toContain('✅ main scenario completed');
        expect(stdout).toContain('The estimated footprint at');
        expect(stdout).toContain('is under the limit configured at 0.1 g eq. co2.');
        expect(stdout).toContain('Check the details of your analysis at');
        expect(error).toBeUndefined();
    });

    it('E2E: Should run an analysis command with adblocker', async () => {
        const { error, stdout } = await exec(
            `${BASE_COMMAND} ./src/examples/greenframe.js https://greenframe.io -s 2 -p GreenFrame -d -a`
        );
        expect(stdout).toContain('✅ main scenario completed');
        expect(stdout).toContain('The estimated footprint is');
        expect(stdout).toContain('Check the details of your analysis at');
        expect(error).toBeUndefined();
    });

    it('E2E: Should run an analysis and fail with higher measure than threshold on greenframe.io', async () => {
        expect.assertions(3);
        try {
            await exec(
                `${BASE_COMMAND} ./src/examples/greenframe.js https://greenframe.io -s 2 -p GreenFrame -d -t 0.001`
            );
        } catch (error) {
            expect(error.stderr).toContain('❌ main scenario failed');
            expect(error.stderr).toContain('The estimated footprint at');
            expect(error.stderr).toContain(
                'passes the limit configured at 0.001 g eq. co2.'
            );
        }
    });

    it('E2E: Should run an analysis with multiple scenario', async () => {
        const { error, stdout } = await exec(
            `${BASE_COMMAND} -C ./.greenframe.e2e.multiple.distant.yml`
        );
        expect(stdout).toContain('✅ Scenario 1 completed');
        expect(stdout).toContain('is under the limit configured at 0.1 g eq. co2.');
        expect(stdout).toContain('✅ Scenario 2 completed');
        expect(stdout).toContain('is under the limit configured at 0.05 g eq. co2.');
        expect(error).toBeUndefined();
    });
});
