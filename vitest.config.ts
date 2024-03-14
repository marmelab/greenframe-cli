/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/__tests__/*.?(c|m)[jt]s?(x)'],
    },
});
