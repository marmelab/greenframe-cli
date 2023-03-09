/* eslint-disable jest/no-conditional-expect */
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const BASE_COMMAND = `GREENFRAME_SECRET_TOKEN=API_TOKEN API_URL=http://localhost:3006 ./bin/run open`;

// we need to setup a mock greenframe.io environment to enable this test
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('[GREENFRAME.IO] greenframe open', () => {
    describe('single page', () => {
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
    });
    describe('full stack', () => {
        // ...
    });
});
