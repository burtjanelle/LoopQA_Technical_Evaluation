export const login = async (page, username = process.env.DEMO_APP_USERNAME, password = process.env.DEMO_APP_PASSWORD) => { 
  const APP_URL = process.env.DEMO_APP_URL;

  if (!APP_URL) {
    throw new Error("Environment variable DEMO_APP_URL is not set.");
  }

  try {
    console.log("Navigating to [REDACTED URL]...");
    await page.goto(APP_URL, { waitUntil: 'networkidle' });

    const usernameField = page.getByRole('textbox', { name: 'Username' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    const signInButton = page.getByRole('button', { name: 'Sign in' });

    await usernameField.waitFor();
    await passwordField.waitFor();
    await signInButton.waitFor();

    console.log("Attempting login with: [REDACTED CREDENTIALS]");
    await usernameField.fill(username);
    await passwordField.fill(password);
    await signInButton.click();

    // Check for successful login
    const dashboardElement = page.getByText('Fix navigation bug');
    if (await dashboardElement.isVisible({ timeout: 5000 })) {
      console.log("Login successful");
      return true;
    }

    // Check for login failure message
    const errorMessage = page.getByText('Invalid username or password');
    if (await errorMessage.isVisible({ timeout: 5000 })) {
      console.log("Login failed: Invalid credentials");
      return false;
    }

  } catch (error) {
    console.error("Login attempt failed:", error);
    throw error;
  }
};
