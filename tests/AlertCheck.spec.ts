import { test, expect } from '@mobilewright/test';
import { goBack } from '../helper/helper';

// Record a video of every test run
test.use({ video: 'on' });

// Logs in, opens the Alerts & Dialogs screen, and verifies the Confirm dialog's OK action
test('Alert', async ({ screen, platform, device }) => {
  // Open the Account tab to reach the login form
  await screen.getByLabel('Account').tap();

  // Enter the username and submit the field
  await screen.getByRole('textfield', { name: 'test-Username' }).fill('demo_user');
  await screen.pressButton('ENTER');

  // Enter the password and submit the field
  await screen.getByRole('textfield', { name: 'test-Password' }).fill('demo_pass');
  await screen.pressButton('ENTER');

  // Android: press BACK to close the keyboard, then log in
  await goBack(screen, platform);
  await screen.getByRole('button', { name: 'test-LOGIN' }).tap();

  // Successful login shows the courses list, e.g. "Showing 12 courses"
  await expect(screen.getByText('Shop')).toBeVisible();

  // Android: press BACK to leave the courses list
  await goBack(screen, platform);

  // Navigate to Components > Alerts & Dialogs
  await screen.getByLabel('Components').tap();
  await screen.getByText('Alerts & Dialogs').tap();

  // Open the Confirm dialog (matched by test ID or by button name, depending on platform)
  await screen.getByTestId('test-Confirm').or(screen.getByRole('button', { name: 'test-Confirm' })).tap();

  // Verify the dialog message, accept it, and check the result text
  await expect(screen.getByText('Do you want to continue?')).toBeVisible();
  await screen.getByRole('button', { name: 'OK' }).tap();
  await expect(screen.getByText('Result: Confirm OK')).toHaveText('Result: Confirm OK');

  // Close the app so the next test starts from a clean state
  await device.terminateApp('com.demo.lebyy');
});
