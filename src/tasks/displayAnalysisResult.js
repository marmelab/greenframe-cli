const ERROR_CODES = require('../services/errors/errorCodes');
const STATUS = require('../status').STATUS;

const APP_BASE_URL = process.env.APP_URL ?? 'https://app.greenframe.io';

const computeTotalMetric = (metric) => Math.round(metric * 1000) / 1000;
const formatTotal = (total, unit) => {
    if (total >= 1_000_000 && unit === 'g') {
        return `${computeTotalMetric(total / 1_000_000)} t`;
    }

    if (total <= 100_000 && total >= 1000) {
        return `${computeTotalMetric(total / 1000)} k${unit}`;
    }

    if (total < 1) {
        return `${computeTotalMetric(total * 1000)} m${unit}`;
    }

    return `${computeTotalMetric(total)} ${unit}`;
};

const displayAnalysisResults = (result, isFree) => {
    console.info('\nAnalysis complete !\n');
    console.info('Result summary:');
    let maximumPrecision = 0;
    for (const scenario of result.scenarios) {
        console.info('\n');
        const totalCo2 = formatTotal(scenario.score?.co2?.total, 'g');
        const totalMWh = formatTotal(scenario.score?.wh?.total, 'Wh');
        const precision = Math.round(scenario.precision * 10) / 10;
        if (precision > maximumPrecision) {
            maximumPrecision = precision;
        }

        if (scenario.status === STATUS.FINISHED) {
            console.info(`✅ ${scenario.name} completed`);
            if (scenario.threshold) {
                console.info(
                    `The estimated footprint at ${totalCo2} eq. co2 ± ${precision}% (${totalMWh}) is under the limit configured at ${scenario.threshold} g eq. co2.`
                );
            } else {
                console.info(
                    `The estimated footprint is ${totalCo2} eq. co2 ± ${precision}% (${totalMWh}).`
                );
            }

            if (scenario.executionCount) {
                console.info(
                    `For ${
                        scenario.executionCount
                    } scenario executions, this represents ${formatTotal(
                        (scenario.score?.co2?.total || 0) * scenario.executionCount,
                        'g'
                    )} eq. co2`
                );
            }
        } else {
            console.error(`❌ ${scenario.name} failed`);
            switch (scenario.errorCode) {
                case ERROR_CODES.SCENARIO_FAILED:
                    console.error(`This scenario failed during the execution:
${scenario.errorMessage}

Use greenframe open command to run your scenario in debug mode.`);
                    break;
                case ERROR_CODES.THRESHOLD_EXCEEDED:
                    console.error(
                        `The estimated footprint at ${totalCo2} eq. co2 ± ${precision}% (${totalMWh}) passes the limit configured at ${scenario.threshold} g eq. co2.`
                    );
                    break;
            }
        }
    }

    if (result.scenarios.length > 1) {
        const totalCo2 = formatTotal(result.computed.score?.co2?.total, 'g');
        const totalMWh = formatTotal(result.computed.score?.wh?.total, 'Wh');

        console.info(
            `\nThe sum of estimated footprint is ${totalCo2} eq. co2 ± ${maximumPrecision}% (${totalMWh}).`
        );
    }

    if (!isFree) {
        console.info(
            `\nCheck the details of your analysis at ${APP_BASE_URL}/analyses/${result.analysis.id}`
        );
    }

    /* prettier-ignore */
    process.exit(
        result.computed.errorCode == null
                ? 0
                : 1
    );
};

module.exports = displayAnalysisResults;
