export const DEFAULT_SAMPLES = 3;
export const CONTAINER_DEVICE_NAME = 'greenframe-runner';
export const GREENFRAME_NAMESPACE = 'greenframe';

export const CONTAINER_TYPES = {
    DEVICE: 'DEVICE' as const,
    SERVER: 'SERVER' as const,
    DATABASE: 'DATABASE' as const,
    NETWORK: 'NETWORK' as const,
};

export const SCENARIO_STATUS = {
    INITIAL: 'initial' as const,
    FINISHED: 'finished' as const,
    FAILED: 'failed' as const,
};

export const ERROR_CODES = {
    SCENARIO_FAILED: 'SCENARIO_FAILED' as const,
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR' as const,
    THRESHOLD_EXCEEDED: 'THRESHOLD_EXCEEDED' as const,
    UNKNOWN_ERROR: 'UNKNOWN_ERROR' as const,
};
