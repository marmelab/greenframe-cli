const ERROR_CODES = require('./errorCodes');

class ConfigurationError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = 'ConfigurationError'; // (2)
        this.errorCode = ERROR_CODES.CONFIGURATION_ERROR;
    }
}

module.exports = ConfigurationError;
