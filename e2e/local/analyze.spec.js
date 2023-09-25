/* eslint-disable jest/no-conditional-expect */
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const BASE_COMMAND = `./bin/run analyze`;

describe('[LOCAL] greenframe analyze', () => {
    describe('single page', () => {
        describe('local analysis', () => {
            it('should raise and error on non HTTPS websites', async () => {
                expect.assertions(2);
                try {
                    await exec(`${BASE_COMMAND} https://untrusted-root.badssl.com/`);
                } catch (error) {
                    expect(error.stderr).toContain('❌ main scenario failed');
                    expect(error.stderr).toContain('net::ERR_CERT_AUTHORITY_INVALID');
                }
            });

            it('should work on non HTTPS websites with --ignoreHTTPSErrors flag', async () => {
                const { stdout } = await exec(
                    `${BASE_COMMAND} https://untrusted-root.badssl.com/ --ignoreHTTPSErrors`
                );
                expect(stdout).toContain('✅ main scenario completed');
            });

            it('should set greenframe browser locale right', async () => {
                const { stdout: enStdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.single.en.yml`
                );
                expect(enStdout).toContain('✅ main scenario completed');
                const { stdout: frStdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.single.fr.yml`
                );
                expect(frStdout).toContain('✅ main scenario completed');
            });

            it('should run an analysis command with adblocker', async () => {
                const { error, stdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.single.adblock.yml`
                );
                expect(stdout).toContain('✅ main scenario completed');
                expect(stdout).toContain('The estimated footprint is');
                expect(error).toBeUndefined();
            });
        });
    });

    // we need to setup a mock dev environment to enable this test
    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('full stack', () => {
        describe('local analysis', () => {
            it('should run an analysis command correctly', async () => {
                const { error, stdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.fullstack.yml`
                );

                expect(stdout).toContain('✅ main scenario completed');
                expect(stdout).toContain('The estimated footprint is');
                expect(error).toBeUndefined();
            });

            it('should run an analysis command below a threshold', async () => {
                const { error, stdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.fullstack.yml -t 0.1`
                );
                expect(stdout).toContain('✅ main scenario completed');
                expect(stdout).toContain('The estimated footprint at');
                expect(stdout).toContain(
                    'is under the limit configured at 0.1 g eq. co2.'
                );
                expect(error).toBeUndefined();
            });

            it('should run an analysis and fail with higher measure than threshold', async () => {
                expect.assertions(3);
                try {
                    await exec(
                        `${BASE_COMMAND}  -C ./e2e/.greenframe.fullstack.yml -s 2 -t 0.001`
                    );
                } catch (error) {
                    expect(error.stderr).toContain('❌ main scenario failed');
                    expect(error.stderr).toContain('The estimated footprint at');
                    expect(error.stderr).toContain(
                        'passes the limit configured at 0.001 g eq. co2.'
                    );
                }
            });

            it('should run an analysis with multiple scenario', async () => {
                const { error, stdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.fullstack.multiple.yml`
                );
                expect(stdout).toContain('✅ Scenario 1 completed');
                expect(stdout).toContain(
                    'is under the limit configured at 0.1 g eq. co2.'
                );
                expect(stdout).toContain('✅ Scenario 2 completed');
                expect(stdout).toContain(
                    'is under the limit configured at 0.05 g eq. co2.'
                );
                expect(error).toBeUndefined();
            });

            it('should fail because "container_broken" is not a running container', async () => {
                expect.assertions(2);
                try {
                    await exec(
                        `${BASE_COMMAND} -C ./e2e/.greenframe.fullstack.broken.yml`
                    );
                } catch (error) {
                    expect(error.stderr).toContain('❌ Failed!');
                    expect(error.stderr).toContain(
                        'container_broken container is not running.'
                    );
                }
            });

            it('should fail because user has reached the project limit', async () => {
                expect.assertions(2);
                try {
                    await exec(
                        `${BASE_COMMAND} -C ./e2e/.greenframe.fullstack.yml -p NewProject`
                    );
                } catch (error) {
                    expect(error.stderr).toContain('❌ Failed!');
                    expect(error.stderr).toContain(
                        "Unauthorized access: You have reached your project's limit."
                    );
                }
            });

            it('should run default analysis command correctly with empty scenario', async () => {
                const { error, stdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.fullstack.emptyScenario.yml`
                );

                expect(stdout).toContain('✅ main scenario completed');
                expect(stdout).toContain('The estimated footprint is');
                expect(error).toBeUndefined();
            });

            // This is disabled because it requires a kubernetes cluster to be running while testing
            // eslint-disable-next-line jest/no-disabled-tests
            it.skip('should run a k8s analysis command correctly', async () => {
                const { error, stdout } = await exec(
                    `${BASE_COMMAND} -C ./e2e/.greenframe.fullstack.k8s.yml`
                );

                expect(stdout).toContain('✅ main scenario completed');
                expect(stdout).toContain('The estimated footprint is');
                expect(error).toBeUndefined();
            });
        });
    });
});
