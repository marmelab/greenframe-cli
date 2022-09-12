const fs = require('node:fs');
const util = require('node:util');
const readFile = util.promisify(fs.readFile);
const path = require('node:path');

const readFileToString = async (configFilePath, scenarioPath) => {
    const configFileFolder = path.dirname(configFilePath);

    // Resolve path regarding where you launch the command and where the config file is located.
    const resolvedScenarioPath = path.resolve(
        process.cwd(), // Where the command is launched
        configFileFolder, // Relative path to config file
        scenarioPath // Relative path of scenario regarding to config file
    );
    const scenarioBuffered = await readFile(resolvedScenarioPath);
    return Buffer.from(scenarioBuffered).toString();
};

module.exports = {
    readFileToString,
};
