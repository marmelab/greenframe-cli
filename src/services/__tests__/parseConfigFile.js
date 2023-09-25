const { resolveParams } = require('../parseConfigFile');

describe('#resolveParams', () => {
    test('Should return flags default values', () => {
        const { flags } = resolveParams(
            {
                default: 'DEFAULT',
                samples: 3,
            },
            {
                args: {
                    scenarios: [{ path: 'PATH_TO_SCENARIO' }],
                    baseURL: 'BASE_URL',
                },
                flags: {},
            },
            {
                args: {},
                flags: {},
            }
        );

        expect(flags).toEqual({
            default: 'DEFAULT',
            samples: 3,
        });
    });

    test('Should not throw an error because no scenario has been provided', () => {
        expect(() => {
            resolveParams(
                {
                    default: 'DEFAULT',
                    samples: 3,
                },
                {
                    args: {
                        baseURL: 'BASE_URL',
                    },
                    flags: {},
                },
                {
                    args: {},
                    flags: {},
                }
            );
        }).not.toThrow();
    });

    test('Should throw an error because no baseURL has been provided', () => {
        expect(() => {
            resolveParams(
                {
                    default: 'DEFAULT',
                    samples: 3,
                },
                {
                    args: { scenarios: [{ path: 'PATH_TO_SCENARIO' }] },
                    flags: {},
                },
                {
                    args: {},
                    flags: {},
                }
            );
        }).toThrow('You must provide a "baseURL" argument.');
    });

    test('Should override defaultFlags by configFile flags', () => {
        const { args, flags } = resolveParams(
            {
                default: 'DEFAULT',
                samples: 3,
            },
            {
                args: {
                    scenarios: [{ path: 'PATH_TO_SCENARIO' }],
                    baseURL: 'YOUR_BASE_URL',
                },
                flags: { samples: 4 },
            },
            {
                args: {},
                flags: {},
            }
        );

        expect(flags).toEqual({
            default: 'DEFAULT',
            samples: 4,
        });

        expect(args).toEqual({
            scenarios: [{ path: 'PATH_TO_SCENARIO' }],
            baseURL: 'YOUR_BASE_URL',
        });
    });

    test('Should override configFile flags and args by command flags and args', () => {
        const { args, flags } = resolveParams(
            {
                default: 'DEFAULT',
                samples: 3,
            },
            {
                args: {
                    scenarios: [{ path: 'PATH_TO_SCENARIO' }],
                    baseURL: 'YOUR_BASE_URL',
                },
                flags: { samples: 4 },
            },
            {
                flags: {},
                args: {
                    baseURL: 'ANOTHER_BASE_URL',
                },
            }
        );

        expect(flags).toEqual({
            default: 'DEFAULT',
            samples: 4,
        });

        expect(args).toEqual({
            scenarios: [{ path: 'PATH_TO_SCENARIO' }],
            baseURL: 'ANOTHER_BASE_URL',
        });
    });
});
