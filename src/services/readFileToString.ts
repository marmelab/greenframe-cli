import { readFile as readfileThen } from 'node:fs';
import { promisify } from 'node:util';
const readFile = promisify(readfileThen);
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
