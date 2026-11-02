# Playwright + Cucumber BDD Framework

A TypeScript browser automation framework for SauceDemo. Cucumber executes the
Gherkin scenarios, and Playwright drives the browser. The Playwright Test runner
is not used.

## A. Project architecture

```text
features/             Gherkin feature files
step-definitions/     Cucumber steps that call page objects
pages/                Page Object Model classes and UI interactions
hooks/                Scenario browser lifecycle and failure screenshots
config/               Validated settings and QA/UAT dotenv files
test-runner/          Cucumber CLI wrapper, tag/filter forwarding, headed mode
utils/                Shared typed Cucumber World
reports/              Generated Cucumber HTML report
screenshots/           Screenshots captured for failed scenarios
cucumber.js            Cucumber feature, TypeScript, and formatter settings
playwright.config.ts    Browser launch defaults used by hooks (not Playwright Test)
```

The feature file contains a valid-login `@smoke` scenario and an invalid-login
`@regression` scenario. Step definitions use `LoginPage` rather than duplicating
browser interactions.

## B. Installation

Use Node.js 20 or newer:

```bash
npm install
```

## C. Install Playwright browsers

Install the browser executable used by the default Chromium configuration:

```bash
npx playwright install chromium
```

For another configured browser, install it with `npx playwright install firefox`
or `npx playwright install webkit`.

## D. Configure environments

`TEST_ENV` selects `config/.env.qa` (the default) or `config/.env.uat`.
Both supplied files use the SauceDemo URL and the requested sample credentials.
Set the environment variables in the selected file for your own environment;
credentials are read from dotenv and are not embedded in TypeScript.

The settings include `BASE_URL`, `USERNAME`, `PASSWORD`, `INVALID_USERNAME`,
`INVALID_PASSWORD`, `BROWSER`, `HEADLESS`, and `TIMEOUT_MS`. Shell environment
variables take precedence over dotenv values. On Windows, `USERNAME` is also a
system account variable, so the selected dotenv file supplies the test username;
use `TEST_USERNAME` when explicitly overriding it. For example:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd
```

Or run QA explicitly:

```powershell
$env:TEST_ENV = "qa"
npm run test:bdd
```

## E. Run all BDD tests

```bash
npm run test:bdd
```

The runner executes every `features/**/*.feature` file and continues through
other scenarios when one fails.

## F. Run a specific feature

```bash
npm run test:bdd -- features/login.feature
```

The Cucumber CLI can also be used directly:

```bash
npx cucumber-js features/login.feature
```

## G. Run a scenario or tag

Run the smoke scenario by tag:

```bash
npx cucumber-js --tags "@smoke"
```

Or use the runner:

```bash
npm run test:bdd -- --tags "@regression"
npm run test:bdd -- --name "Successful login with valid credentials"
```

The `@smoke` and `@regression` tags are defined in `features/login.feature`.

## H. Run in headed mode

```bash
npm run test:bdd:headed
```

This sets `HEADLESS=false` for the Cucumber process. Other environment settings
remain unchanged.

## I. Generate the HTML report

```bash
npm run test:bdd:html
```

The configured Cucumber HTML formatter writes `reports/cucumber-report.html`.
The report includes feature/scenario/step results, timing, failure details, and
embedded screenshots for failed scenarios.

## J. Failure screenshots

The Cucumber `After` hook checks the scenario result. When a scenario fails, it
saves a PNG in `screenshots/` and attaches the image bytes to the Cucumber
scenario. The HTML formatter displays that attachment. Page, context, and
browser cleanup is attempted even if screenshot capture fails.

## K. End-to-end execution flow

The Gherkin feature describes behavior. Cucumber matches each step to a
TypeScript step definition. The step definition calls a method on `LoginPage`,
which uses Playwright's `Page` API to interact with the browser. Cucumber hooks
create the browser session before each scenario and close it afterward; Cucumber
then records the results and any failure screenshot in its report.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

### Key concepts

- **Feature file / Gherkin:** describes application behavior in readable,
  structured `Given`/`When`/`Then` steps.
- **Step definitions:** TypeScript implementations that connect each Gherkin
  step to application operations.
- **Page Object Model:** `LoginPage` owns selectors and login-page interactions.
- **Hooks:** Cucumber lifecycle callbacks that provision and clean up browser
  resources and capture screenshots on failures.
- **Browser, BrowserContext, and Page:** Playwright's browser engine, isolated
  browser session, and individual tab, respectively.
- **Reporting:** Cucumber's HTML formatter records scenario/step statuses,
  durations, errors, and attached screenshot images.
