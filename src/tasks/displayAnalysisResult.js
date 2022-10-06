const ERROR_CODES = require('../services/errors/errorCodes');
const STATUS = require('../status').STATUS;

const APP_BASE_URL = process.env.APP_URL ?? 'https://app.greenframe.io';

const computeTotalMetric = (metric) => Math.round(metric * 1000) / 1000;
const formatTotalCo2 = (total) => {
    if (total >= 1_000_000) {
        return `${computeTotalMetric(total / 1_000_000)} t`;
    }

    if (total <= 100_000 && total >= 1000) {
        return `${computeTotalMetric(total / 1000)} kg`;
    }

    return `${computeTotalMetric(total)} g`;
};

const displayAnalysisResults = (result, isFree, isDistant) => {
    console.info('\nAnalysis complete !\n');
    console.info('Result summary:');
    let maximumPrecision = 0;
    for (const scenario of result.scenarios) {
        console.info('\n');
        const totalCo2 = computeTotalMetric(scenario.score?.co2?.total);
        const totalMWh = computeTotalMetric(scenario.score?.wh?.total);
        const precision = Math.round(scenario.precision * 10) / 10;
        if (precision > maximumPrecision) {
            maximumPrecision = precision;
        }

        if (scenario.status === STATUS.FINISHED) {
            console.info(`✅ ${scenario.name} completed`);
            if (scenario.threshold) {
                console.info(
                    `The estimated footprint at ${totalCo2} g eq. co2 ± ${precision}% (${totalMWh} Wh) is under the limit configured at ${scenario.threshold} g eq. co2.`
                );
            } else {
                console.info(
                    `The estimated footprint is ${totalCo2} g eq. co2 ± ${precision}% (${totalMWh} Wh).`
                );
            }

            if (scenario.executionCount) {
                console.info(
                    `For ${
                        scenario.executionCount
                    } scenario executions, this represents ${formatTotalCo2(
                        totalCo2 * scenario.executionCount
                    )} eq. co2`
                );
            }
        } else {
            console.error(`❌ ${scenario.name} failed`);
            switch (scenario.errorCode) {
                case ERROR_CODES.SCENARIO_FAILED:
                    console.error(`This scenario fail during the execution:
${scenario.errorMessage}
                    
Use greenframe open command to run your scenario in debug mode.`);
                    break;
                case ERROR_CODES.THRESHOLD_EXCEEDED:
                    console.error(
                        `The estimated footprint at ${totalCo2} g eq. co2 ± ${precision}% (${totalMWh} Wh) passes the limit configured at ${scenario.threshold} g eq. co2.`
                    );
                    break;
            }
        }
    }

    if (!isDistant && result.scenarios.length > 1) {
        const totalCo2 = computeTotalMetric(result.computed.score?.co2?.total);
        const totalMWh = computeTotalMetric(result.computed.score?.wh?.total);

        console.info(
            `\nThe sum of estimated footprint is ${totalCo2} g eq. co2 ± ${maximumPrecision}% (${totalMWh} Wh).`
        );
    }

    if (!isFree) {
        console.info(
            `\nCheck the details of your analysis at ${APP_BASE_URL}/analyses/${result.analysis.id}`
        );
    }

    /* prettier-ignore */
    process.exit(
        isDistant
            ? result.analysis.status === STATUS.FINISHED
                ? 0
                : 1
            : result.computed.errorCode == null
                ? 0
                : 1
    );
};

module.exports = displayAnalysisResults;
