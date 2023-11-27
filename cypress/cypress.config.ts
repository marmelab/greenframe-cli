import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: '/scenarios/default-greenframe-config/support/e2e.ts',
    },
});
