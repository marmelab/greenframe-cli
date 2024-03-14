import minimist from 'minimist';

import executeScenario from './scenarioWrapper.js';

const getScenarioPath = (scenario: string) => {
    const scenarioPath = decodeURIComponent(scenario);

    if (scenarioPath.startsWith('./')) {
        return scenarioPath.replace('.', '/scenarios');
    }

    return scenarioPath;
};

(async () => {
    const args = minimist(process.argv.slice(2));
    const scenarioPath = getScenarioPath(args.scenario);
    const scenarioFileContent = await import(scenarioPath).then(
        (module) => module.default
    );
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
