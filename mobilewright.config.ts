import { defineConfig } from 'mobilewright';
import path from 'path';
import { browserStackDriver } from '@browserstack/mobilewright';
import type { MobilewrightDriver } from '@mobilewright/protocol';

// Target platform for the BrowserStack run ('ios' or 'android'); defaults to Android.
const platform = process.env.PLATFORM ?? 'android';

export default defineConfig({
  // Directory to search for test files (project root).
  testDir: './tests',
  // Maximum time per test, in milliseconds (2 minutes).
  timeout: 120_000,
  // Bundle ID / package name of the app under test.
  bundleId: 'com.demo.lebyy',
  // Number of parallel worker processes.
  workers: 2,
  // Generate an HTML test report.
  reporter: 'html',
  // Maximum time for the whole test run (30 minutes).
  globalTimeout: 30 * 60 * 1000,
  // Number of times to retry a failed test (0 = no retries).
  retries: 0,
  // Capture the app's view hierarchy only when a test fails.
  viewTree: 'on-failure',
  // Launch the app automatically before each test.
  autoAppLaunch: true,
  // Run tests within a single file in parallel, not just across files.
  fullyParallel: true,
  // Per-platform projects; pick one with --project=ios or --project=android.
  projects: [
    {
      name: 'ios',
      use: {
        platform: 'ios',
        // Match any available iOS device/simulator name.
        deviceName: /.*/,
        // Zipped iOS simulator .app build to install before tests.
        installApps: path.join(__dirname, 'apps', 'Lebyy.zip'),
      },
    },
    {
      name: 'android',
      use: {
        platform: 'android',
        // Match any available Android device/emulator name.
        deviceName: /.*/,
        // Debug APK to install before tests.
        installApps: path.join(__dirname, 'apps', 'Lebyy-debug.apk'),
      },
    },
  ],
});
