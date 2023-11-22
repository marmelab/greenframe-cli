const minimist = require('minimist');

const executeScenario = require('./scenarioWrapper');

(async () => {
    const args = minimist(process.argv.slice(2));
    const { timelines, milestones } = await executeScenario({
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
