/* eslint-disable jest/no-conditional-expect */
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const BASE_COMMAND = `./bin/run open`;

describe.skip('[LOCAL] greenframe open', () => {
    describe('single page', () => {
        it('should run correctly', async () => {
            const { error, stdout } = await exec(`${BASE_COMMAND} https://greenframe.io`);

            expect(stdout).toContain('✅ main scenario:');
            expect(stdout).toContain('GreenFrame scenarios finished successfully !');
            expect(stdout).toContain(
                'You can now run an analysis to estimate the consumption of your application'
            );
            expect(error).toBeUndefined();
        });
    });
    // we need to setup a mock dev environment to enable this test
    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('full stack', () => {
        // ...
    });
});
