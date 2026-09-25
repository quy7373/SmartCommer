import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:5188',
        trace: 'on-first-retry',
        channel: 'chrome',
        headless: true,
    },
    projects: [
        {
            name: 'chrome',
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
            },
        },
    ],
    webServer: {
        command: 'npx vite --port 5188 --strictPort',
        url: 'http://localhost:5188',
        reuseExistingServer: true,
        timeout: 120000,
    },
});

