import { After, Before, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, webkit, type BrowserType } from "playwright";
import { frameworkConfig, type BrowserName } from "../config/config";
import { playwrightConfig } from "../playwright.config";
import { LoginPage } from "../pages/LoginPage";
import type { TestWorld } from "../utils/world";

const browserTypes: Record<BrowserName, BrowserType> = {
  chromium,
  firefox,
  webkit,
};

setDefaultTimeout(frameworkConfig.timeout);

Before({ timeout: frameworkConfig.timeout }, async function (this: TestWorld) {
  // Browser is the browser engine; BrowserContext is an isolated session with its own state.
  this.browser = await browserTypes[frameworkConfig.browser].launch(
    playwrightConfig.launchOptions,
  );
  this.context = await this.browser.newContext({
    baseURL: playwrightConfig.baseURL,
  });
  // Page is the tab used by Playwright to interact with the application.
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(
  { timeout: frameworkConfig.timeout },
  async function (this: TestWorld, scenario) {
    const errors: unknown[] = [];

    if (scenario.result?.status === Status.FAILED && this.page) {
      try {
        const screenshotDirectory = path.resolve("screenshots");
        await mkdir(screenshotDirectory, { recursive: true });
        const safeScenarioName = scenario.pickle.name
          .replace(/[^a-zA-Z0-9-_]+/g, "-")
          .replace(/^-|-$/g, "");
        const screenshotPath = path.join(
          screenshotDirectory,
          `${safeScenarioName}-${Date.now()}.png`,
        );
        const screenshot = await this.page.screenshot({ path: screenshotPath });
        // Cucumber's HTML formatter renders attached image/png data in the report.
        await this.attach(screenshot, "image/png");
      } catch (error) {
        errors.push(error);
      }
    }

    const cleanup = [
      async () => this.page?.close(),
      async () => this.context?.close(),
      async () => this.browser?.close(),
    ];

    for (const closeResource of cleanup) {
      try {
        await closeResource();
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw new AggregateError(errors, "Screenshot capture or browser cleanup failed.");
    }
  },
);
