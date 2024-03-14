import { promisify } from 'node:util';
import { exec as execThen } from 'node:child_process';
const exec = promisify(execThen);

export async function getDockerVersion() {
    const { stdout } = await exec('docker -v');
    return stdout.trim();
}
