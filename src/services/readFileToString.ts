import fs from 'node:fs';
import util from 'node:util';
const readFile = util.promisify(fs.readFile);
import path from 'node:path';

export const readFileToString = async (configFilePath: string, scenarioPath: string) => {
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
