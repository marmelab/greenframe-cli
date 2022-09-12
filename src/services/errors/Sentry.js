const Sentry = require('@sentry/node');

Sentry.init({
    dsn: 'https://ef45583ebb964bc485f37ef92d01609f@o956285.ingest.sentry.io/5905652',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1,
});

const logErrorOnSentry = (e) => {
    Sentry.captureException(e);
};

module.exports = logErrorOnSentry;
