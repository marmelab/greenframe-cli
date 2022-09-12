import ConfigurationError from '../services/errors/ConfigurationError';

export default async () => {
    if (!process.env.GREENFRAME_SECRET_TOKEN) {
        throw new ConfigurationError(
            'You must provide a variable named "GREENFRAME_SECRET_TOKEN" to authenticate yourself to the API.\nIf you do not have a token, You can run a free analysis with the --free argument.\n\nMore information can be found here: https://docs.greenframe.io/commands#--free-option'
        );
    }
};
