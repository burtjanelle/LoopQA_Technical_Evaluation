import { test, expect } from '@playwright/test';
import { login } from '../utils/login';
import loginData from '../data/loginData.json';
import dotenv from 'dotenv';

dotenv.config();

const APP_URL = process.env.DEMO_APP_URL;

if (!APP_URL) {
  throw new Error("Environment variable DEMO_APP_URL is missing.");
}

// Parameterized test cases (Replace placeholders with real values)
const testCases = loginData.map(data => ({
  ...data,
  username: data.username === "ENV_USERNAME" ? process.env.DEMO_APP_USERNAME : data.username,
  password: data.password === "ENV_PASSWORD" ? process.env.DEMO_APP_PASSWORD : data.password
}));

test.describe('Login Tests - Valid & Invalid Inputs', () => {
  testCases.forEach((data) => {
    test(`${data.testCase}`, async ({ page }) => {
      console.log(`Running Test: ${data.testCase}`);

      // Navigate to login page
      await page.goto(APP_URL, { waitUntil: 'networkidle' });

      const usernameField = page.getByRole('textbox', { name: 'Username' });
      const passwordField = page.getByRole('textbox', { name: 'Password' });
      const signInButton = page.getByRole('button', { name: 'Sign in' });

      // Ensure all elements are available before interacting
      await expect(async () => await usernameField.waitFor()).toPass({ timeout: 10000 });
      await expect(async () => await passwordField.waitFor()).toPass({ timeout: 10000 });
      await expect(async () => await signInButton.waitFor()).toPass({ timeout: 10000 });

      console.log(`Attempting login with: ${data.username ? '[REDACTED]' : 'EMPTY'} / ${data.password ? '[REDACTED]' : 'EMPTY'}`);

      // Only fill fields if they are not empty
      if (data.username) await usernameField.fill(data.username);
      if (data.password) await passwordField.fill(data.password);
      await signInButton.click();

      if (data.expectedResult === "success") {
        // Expect login to succeed
        await expect(async () => {
          await expect(page.getByText('Fix navigation bug')).toBeVisible();
        }).toPass({ timeout: 10000 });

        console.log(`PASSED: ${data.testCase} - Successfully logged in`);

      } else if (!data.username || !data.password) {
        // Expect required field validation
        await expect(async () => {
          await expect(usernameField).toHaveAttribute('required');
          await expect(passwordField).toHaveAttribute('required');
        }).toPass({ timeout: 5000 });

        console.log(`PASSED: ${data.testCase} - Empty fields correctly blocked`);

      } else {
        // Expect login to fail with an error message
        await expect(async () => {
          await expect(page.getByText('Invalid username or password')).toBeVisible();
        }).toPass({ timeout: 5000 });

        console.log(`PASSED: ${data.testCase} - Invalid login correctly rejected`);
      }
    });
  });
});
