const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function getDockerVersion() {
    const { stdout } = await exec('docker -v');
    return stdout.trim();
}

module.exports = { getDockerVersion };
