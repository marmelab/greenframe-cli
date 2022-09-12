const ERROR_CODES = require('./errorCodes');

class ScenarioError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = 'ScenarioError'; // (2)
        this.errorCode = ERROR_CODES.SCENARIO_FAILED;
    }
}

module.exports = ScenarioError;
