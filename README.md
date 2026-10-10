# MobileWrightWorkshop

A mobile test automation framework built on [Mobilewright](https://www.npmjs.com/package/mobilewright) and TypeScript. It runs end-to-end UI tests against the **Lebyy** demo app (`com.demo.lebyy`) on both **Android** and **iOS**.

---

## Project structure

```
MobileWrightWorkshop/
├── apps/
│   ├── Lebyy-debug.apk        # Android debug build, installed before Android tests
│   └── Lebyy.zip              # Zipped iOS simulator .app, installed before iOS tests
├── helper/
│   └── helper.ts              # Shared helpers (e.g. goBack for the Android BACK button)
├── tests/
│   ├── Login.spec.ts          # Login with valid credentials and verify the Shop screen
│   └── AlertCheck.spec.ts     # Login, open Components > Alerts & Dialogs, verify the Confirm dialog
├── mobilewright.config.ts     # Framework configuration (timeouts, workers, projects, reporter)
├── package.json
└── tsconfig.json
```

---

## Prerequisites

### 1. Tools to install

| Tool | Needed for |
| --- | --- |
| [Node.js](https://nodejs.org/) 18+ and npm | Running Mobilewright and the tests |
| Android Studio (Android SDK, `adb`, an emulator) | Android runs |
| Xcode with an iOS Simulator (macOS only) | iOS runs |

### 2. Install dependencies

```bash
git clone <repo-url>
cd MobileWrightWorkshop
npm install
```
###OR

Download as zip file from https://github.com/Fint-Solutions-Internal/MobileWrightWorkshop
1. Extract the zip file and open the folder in VS Code
2. Run command - npm install --save-dev mobilewright @mobilewright/test

### 3. Verify your setup with the Mobilewright CLI



> Start an Android emulator or iOS simulator **before** running `devices`, `inspect`, `codegen` or `test`.

---

## Running the tests

```bash
# All tests on all configured projects
npx mobilewright test        # or: npm test

# Android only
npx mobilewright test --project=android

# iOS only
npx mobilewright test --project=ios

# A single spec file
npx mobilewright test tests/Login.spec.ts
```

After a run, open the report:

```bash
npx mobilewright show-report
```

---

## Configuration

All settings live in [mobilewright.config.ts](mobilewright.config.ts).

| Setting | Value | Meaning |
| --- | --- | --- |
| `testDir` | `./tests` | Where test files are found |
| `bundleId` | `com.demo.lebyy` | App under test |
| `timeout` | 120 000 ms | Maximum time per test |
| `globalTimeout` | 30 min | Maximum time for the whole run |
| `workers` | 2 | Parallel worker processes |
| `fullyParallel` | `true` | Tests inside one file also run in parallel |
| `retries` | 0 | Failed tests are not retried |
| `reporter` | `html` | Generates an HTML report |
| `viewTree` | `on-failure` | Captures the view hierarchy when a test fails |
| `autoAppLaunch` | `true` | Launches the app before each test |

### Projects

| Project | Platform | App installed | Device |
| --- | --- | --- | --- |
| `android` | Android | `apps/Lebyy-debug.apk` | Any available device/emulator |
| `ios` | iOS | `apps/Lebyy.zip` | Any available simulator |

Each test also sets `test.use({ video: 'on' })`, so a video is recorded for every run.

---

## Writing a test

Tests use the `test` and `expect` fixtures from `@mobilewright/test`. Each test receives `screen` (find and interact with elements), `device` (control the app/device) and `platform` (`'android'` or `'ios'`).

```ts
import { test, expect } from '@mobilewright/test';
import { goBack } from '../helper/helper';

test.use({ video: 'on' });

test('Login Validation', async ({ screen, platform, device }) => {
  await screen.getByLabel('Account').tap();

  await screen.getByRole('textfield', { name: 'test-Username' }).fill('demo_user');
  await screen.pressButton('ENTER');

  await screen.getByRole('textfield', { name: 'test-Password' }).fill('demo_pass');
  await screen.pressButton('ENTER');

  await goBack(screen, platform); // closes the Android keyboard
  await screen.getByRole('button', { name: 'test-LOGIN' }).tap();

  await expect(screen.getByText('Shop')).toBeVisible();

  await device.terminateApp('com.demo.lebyy');
});
```

### Common locators and actions

| API | Example |
| --- | --- |
| `getByLabel` | `screen.getByLabel('Account')` |
| `getByRole` | `screen.getByRole('button', { name: 'OK' })` |
| `getByText` | `screen.getByText('Alerts & Dialogs')` |
| `getByTestId` | `screen.getByTestId('test-Confirm')` |
| `.or()` | `screen.getByTestId('x').or(screen.getByRole('button', { name: 'x' }))` (for locators that differ by platform) |
| `.tap()` / `.fill()` | Tap an element / type text |
| `screen.pressButton()` | Press a hardware/keyboard key, e.g. `'ENTER'`, `'BACK'` |
| `device.terminateApp()` | Close the app so the next test starts clean |

Tips:

- Use `npx mobilewright inspect` to find labels, roles and test IDs.
- Use `npx mobilewright codegen` to record a flow, then tidy the generated code into a spec.
- Put reusable steps in [helper/helper.ts](helper/helper.ts). For example, `goBack(screen, platform)` presses BACK on Android and does nothing on iOS.

---

## Test data

| Field | Value |
| --- | --- |
| Username | `demo_user` |
| Password | `demo_pass` |
