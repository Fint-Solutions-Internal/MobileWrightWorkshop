import type { Screen, Locator } from 'mobilewright';

/**
 * Presses the Android BACK button. Does nothing on other platforms.
 */
export async function goBack(screen: Screen, platform: string | undefined): Promise<void> {
  if (platform === 'android') {
    await screen.pressButton('BACK');
  }
}