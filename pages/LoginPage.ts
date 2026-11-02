import type { Locator, Page } from "playwright";

// The Page Object Model keeps selectors and page interactions out of step definitions.
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly inventoryList: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto("/");
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForURL("**/inventory.html");
    await this.inventoryList.waitFor({ state: "visible" });
  }

  async verifyLoginError(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible" });
    const message = await this.errorMessage.textContent();
    if (!message?.trim()) {
      throw new Error("The login error was displayed without an error message.");
    }
  }
}
