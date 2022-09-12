import { access } from 'node:fs';
import util from 'node:util';
import ConfigurationError from './errors/ConfigurationError';

const accessPromise = util.promisify(access);

const PATHS = [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/local/bin/chromium',
    '/usr/local/bin/chromium-browser',
    '/usr/local/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

export const detectExecutablePath = async () => {
    for (const path of PATHS) {
        try {
            await accessPromise(path);
            return path;
        } catch {
            //  Do nothing;
        }
    }

    throw new ConfigurationError(`No Chromium browser found at the following paths:\n${PATHS.join(
        '\n'
    )}.
Install one by typing:
    'sudo apt-get install chromium-browser' (or 'brew install --cask chromium' for mac)`);
};
