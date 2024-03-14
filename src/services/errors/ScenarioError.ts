import ERROR_CODES from './errorCodes.js';

class ScenarioError extends Error {
    errorCode: keyof typeof ERROR_CODES;
    constructor(message: string) {
        super(message); // (1)
        this.name = 'ScenarioError'; // (2)
        this.errorCode = ERROR_CODES.SCENARIO_FAILED;
    }
}

export default ScenarioError;
