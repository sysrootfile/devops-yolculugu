import { defineConfig } from '@playwright/test';

// E2E testleri: derlenmiş siteyi (npm run preview) gerçek tarayıcıda sınar.
// Çalıştır: npm run test:e2e  (tarayıcı kurulumu: npx playwright install chromium)
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321/devops-yolculugu/',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
