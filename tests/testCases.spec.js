import { test, expect } from '@playwright/test';
import { login } from '../utils/login';
import testData from '../data/testData.json';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const APP_URL = process.env.DEMO_APP_URL;

if (!APP_URL) {
  throw new Error("Environment variable DEMO_APP_URL is missing.");
}

test.describe('Automated Test Cases for Web & Mobile Applications', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await login(page);
  });

  testData.forEach((data) => {
    test(`${data.testCase} - ${data.application}`, async ({ page }) => {
      try {
        console.log(`Running Test: ${data.testCase} - ${data.application}`);

        // Navigate to Application Section
        const sidebarProjects = page.getByRole('button', { name: data.application });
        await expect(async () => await sidebarProjects.waitFor()).toPass({ timeout: 10000 });
        await sidebarProjects.click();

        // Locate Task Element
        const taskLocator = page.locator('div', { hasText: data.task }).first();
        await expect(async () => await taskLocator.waitFor()).toPass({ timeout: 10000 });
        await expect(taskLocator).toBeVisible();

        // Scroll into view & click task
        await taskLocator.scrollIntoViewIfNeeded();
        await taskLocator.click();

        // Verify Column Placement
        const columnLocator = page.locator('h2', { hasText: data.column }).first();
        await expect(async () => await columnLocator.waitFor()).toPass({ timeout: 10000 });
        await expect(columnLocator).toBeVisible();

        // Confirm Success: Task & Column
        console.log(`Task "${data.task}" is correctly placed in the "${data.column}" column.`);

        // Verify Tags
        for (const tag of data.tags) {
          const tagLocator = taskLocator.locator('span', { hasText: tag }).first();
          await expect(async () => await tagLocator.waitFor()).toPass({ timeout: 10000 });
          await expect(tagLocator).toBeVisible();

          console.log(`Verified tag: "${tag}" for task "${data.task}".`);
        }

        console.log(`PASSED: ${data.testCase} - ${data.application}`);

      } catch (error) {
        console.error(`FAILED: ${data.testCase} - ${data.application}`);
        console.error(`   Reason: ${error.message}`);
        throw error;
      }
    });
  });

});
