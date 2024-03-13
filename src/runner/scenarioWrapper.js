import getScopedPage from './scopedPage';

const { chromium } = require('playwright');
const { PlaywrightBlocker } = require('@cliqz/adblocker-playwright');
const fetch = require('cross-fetch'); // required 'fetch'

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

    const browser = await chromium.launch({
        defaultViewport: {
            width: 900,
            height: 600,
        },
        args,
        timeout: 10_000,
        headless: !options.debug,
        executablePath: options.executablePath,
    });

    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36',
        ignoreHTTPSErrors: options.ignoreHTTPSErrors,
        locale: options.locale,
        timezoneId: options.timezoneId,
    });

    context.setDefaultTimeout(60_000);

    const page = getScopedPage(await context.newPage(), options.baseUrl);

    if (options.useAdblock) {
        const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);
        blocker.enableBlockingInPage(page);
    }

    await page.waitForTimeout(2000);

    const start = new Date();
    let success = false;
    try {
        const timeoutScenario = setTimeout(() => {
            throw new Error(
                `Timeout: Your scenario took more than ${SCENARIO_TIMEOUT / 1000}s`
            );
        }, SCENARIO_TIMEOUT);

        await scenario(page);
        clearTimeout(timeoutScenario);

        success = true;
    } finally {
        if (!options.debug || success) {
            await browser.close();
        }
    }

    const end = new Date();

    return {
        timelines: {
            title: options.name,
            start: start.toISOString(),
            end: end.toISOString(),
        },
        milestones: relativizeMilestoneSamples(page.getMilestones(), start.getTime()),
    };
};

process.on('uncaughtException', (err) => {
    throw err;
});

process.on('unhandledRejection', (err) => {
    throw err;
});

module.exports = executeScenario;
