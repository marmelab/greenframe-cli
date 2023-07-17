const minimist = require('minimist');
const path = require('node:path');

const executeScenario = require('./scenarioWrapper');

(async () => {
    const args = minimist(process.argv.slice(2));
    /*const scenarioPath = path.resolve(
        __dirname,
        '..',
        '..',
        decodeURIComponent(args.scenario)
    );*/
    const scenarioPath = decodeURIComponent(args.scenario);
    const scenarioFileContent = require(scenarioPath);
    const { timelines, milestones } = await executeScenario(scenarioFileContent, {
        baseUrl: decodeURIComponent(args.url),
        hostIP: process.env.HOSTIP,
        extraHosts: process.env.EXTRA_HOSTS ? process.env.EXTRA_HOSTS.split(',') : [],
        useAdblock: args.useAdblock,
        ignoreHTTPSErrors: args.ignoreHTTPSErrors,
        locale: args.locale,
        timezoneId: args.timezoneId,
    });
    console.log('=====TIMELINES=====');
    console.log(JSON.stringify(timelines));
    console.log('=====TIMELINES=====');
    console.log('=====MILESTONES=====');
    console.log(JSON.stringify(milestones));
    console.log('=====MILESTONES=====');
})();
