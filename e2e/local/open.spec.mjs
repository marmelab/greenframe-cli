import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { exec as execThen } from 'node:child_process';
const exec = promisify(execThen);

const BASE_COMMAND = `./bin/run open`;

// This is disabled because popping chrome in CI doesn't seem to work as-is
// the test works locally though

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

    describe.skip('full stack', () => {
        // ...
    });
});
