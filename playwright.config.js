import fs from 'fs';
require('dotenv').config();

export default {
  workers: 1,
  retries: 2,
  use: {
  
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  reportSlowTests: null,
  reporter: [['html', { outputFolder: 'test-report' }]],
};
