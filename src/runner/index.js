const minimist = require('minimist');

const executeScenario = require('./scenarioWrapper');

const getFilePath = (file) => {
    if (!file) {
        return;
    }

    const filePath = decodeURIComponent(file);

    if (filePath.startsWith('./')) {
        return filePath.replace('.', '/scenarios');
    }

    return filePath;
};

(async () => {
    const args = minimist(process.argv.slice(2));
    const scenarioPath = getFilePath(args.scenario);
    const cypressConfigFile = getFilePath(args.cypressConfigFile);
    const { timelines, milestones } = await executeScenario(scenarioPath, {
        debug: false,
        baseUrl: decodeURIComponent(args.url),
        hostIP: process.env.HOSTIP,
        extraHosts: process.env.EXTRA_HOSTS ? process.env.EXTRA_HOSTS.split(',') : [],
        useAdblock: args.useAdblock,
        ignoreHTTPSErrors: args.ignoreHTTPSErrors,
        locale: args.locale,
        timezoneId: args.timezoneId,
        timeout: args.timeout,
        cypressConfigFile: cypressConfigFile,
    });
    console.log('=====TIMELINES=====');
    console.log(JSON.stringify(timelines));
    console.log('=====TIMELINES=====');
    console.log('=====MILESTONES=====');
    console.log(JSON.stringify(milestones));
    console.log('=====MILESTONES=====');
})();
