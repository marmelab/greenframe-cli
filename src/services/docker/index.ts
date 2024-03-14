import util from 'node:util';
import { exec as execSync } from 'node:child_process';
const exec = util.promisify(execSync);

export async function getDockerVersion() {
    const { stdout } = await exec('docker -v');
    return stdout.trim();
}
