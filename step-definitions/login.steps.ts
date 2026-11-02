import { Given, Then, When } from "@cucumber/cucumber";
import { frameworkConfig } from "../config/config";
import type { TestWorld } from "../utils/world";

// Step definitions bind readable Gherkin steps to reusable page-object behavior.
Given("I navigate to the login page", async function (this: TestWorld) {
  await this.getLoginPage().navigateToLoginPage();
});

When("I enter valid username and password", async function (this: TestWorld) {
  const loginPage = this.getLoginPage();
  await loginPage.enterUsername(frameworkConfig.username);
  await loginPage.enterPassword(frameworkConfig.password);
});

When("I enter invalid username and password", async function (this: TestWorld) {
  const loginPage = this.getLoginPage();
  await loginPage.enterUsername(frameworkConfig.invalidUsername);
  await loginPage.enterPassword(frameworkConfig.invalidPassword);
});

When("I click the login button", async function (this: TestWorld) {
  await this.getLoginPage().clickLogin();
});

Then("I should be successfully logged in", async function (this: TestWorld) {
  await this.getLoginPage().verifySuccessfulLogin();
});

Then("I should see a login error message", async function (this: TestWorld) {
  await this.getLoginPage().verifyLoginError();
});
