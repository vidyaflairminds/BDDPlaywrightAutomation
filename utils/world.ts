import { setWorldConstructor, World, type IWorldOptions } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "playwright";
import type { LoginPage } from "../pages/LoginPage";

// A custom Cucumber World shares scenario-specific Playwright objects between hooks and steps.
export class TestWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  getLoginPage(): LoginPage {
    if (!this.loginPage) {
      throw new Error("LoginPage is unavailable; the scenario setup hook did not complete.");
    }
    return this.loginPage;
  }
}

setWorldConstructor(TestWorld);
