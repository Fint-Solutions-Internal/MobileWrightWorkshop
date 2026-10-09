import { test, expect } from '@mobilewright/test';
import { goBack } from '../helper/helper';

// Record a video of every test run
test.use({ video: 'on' });

// Verifies a user can log in with valid credentials and land on the courses list
test('Login Validation', async ({ screen, platform, device }) => {
  // Open the Account tab to reach the login form
  await screen.getByLabel('Account').tap();

  // Enter the username and submit the field
  await screen.getByRole('textfield', { name: 'test-Username' }).fill('demo_user');
  await screen.pressButton('ENTER');

  // Enter the password and submit the field
  await screen.getByRole('textfield', { name: 'test-Password' }).fill('demo_pass');
  await screen.pressButton('ENTER');

  // Dismiss the Android keyboard if it hides the LOGIN button, then log in
  const loginButton = screen.getByRole('button', { name: 'test-LOGIN' });
  await goBack(screen, platform);
  await loginButton.tap();

  // Successful login shows the courses list, e.g. "Showing 12 courses"
  //await expect(screen.getByText(/^Showing \d+ courses$/)).toBeVisible();
  await expect(screen.getByText('Shop')).toBeVisible();
  
  // Close the app so the next test starts from a clean state
  await device.terminateApp('com.demo.lebyy');
});
