const cypress = require('cypress');
const path = require('node:path');
const PROJECT_ROOT = path.resolve(__dirname, '../../');
const SCENARIO_TIMEOUT = 2 * 60 * 1000; // Global timeout for executing a scenario

const relativizeMilestoneSamples = (milestones, startTime) =>
    milestones.map(({ timestamp, ...milestone }) => ({
        ...milestone,
        time: timestamp - startTime,
    }));

const executeScenario = async (scenario, options = {}) => {
    let args = ['--disable-web-security'];

    if (options.hostIP) {
        args.push(`--host-rules=MAP localhost ${options.hostIP}`);
        for (const extraHost of options.extraHosts) {
            args.push(`--host-rules=MAP ${extraHost} ${options.hostIP}`);
        }
    }

    let start;
    let end;

    const timeoutScenario = setTimeout(() => {
        throw new Error(
            `Timeout: Your scenario took more than ${SCENARIO_TIMEOUT / 1000}s`
        );
    }, SCENARIO_TIMEOUT);

    console.log('Running scenario', scenario);

    // - TODO: OPEN -> check with my scenarios -------> DONE
    // - TODO: OPEN -> check with many scenarios -----> todo
    // - TODO: OPEN -> check with failed scenario ----> todo

    const cypressResults = await cypress.run({
        browser: 'chrome',
        testingType: 'e2e',
        project: options.debug ? PROJECT_ROOT : '/greenframe',
        spec: scenario,
        config: { baseUrl: options.baseUrl, specPattern: scenario },
        headless: !options.debug,
        headed: options.debug,
        quiet: true,
    });

    if (cypressResults.status === 'failed') {
        throw new Error(cypressResults.message);
    }

    if (cypressResults.runs[0].error) {
        throw new Error(cypressResults.runs[0].error);
    }

    start = cypressResults.runs[0].stats.startedAt;
    end = cypressResults.runs[0].stats.endedAt;

    clearTimeout(timeoutScenario);

    return {
        timelines: {
            title: options.name,
            start,
            end,
        },
        // milestones: relativizeMilestoneSamples(page.getMilestones(), start),
        milestones: [],
    };
};

process.on('uncaughtException', (err) => {
    throw err;
});

process.on('unhandledRejection', (err) => {
    throw err;
});

module.exports = executeScenario;
