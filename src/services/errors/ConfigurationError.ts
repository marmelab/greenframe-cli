import ERROR_CODES from './errorCodes.js';

export default class ConfigurationError extends Error {
    errorCode: keyof typeof ERROR_CODES;
    constructor(message: string) {
        super(message); // (1)
        this.name = 'ConfigurationError'; // (2)
        this.errorCode = ERROR_CODES.CONFIGURATION_ERROR;
    }
}
