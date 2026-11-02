import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

export type BrowserName = "chromium" | "firefox" | "webkit";

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable "${name}".`);
  }
  return value.trim();
}

function parseBoolean(name: string, value: string): boolean {
  if (value.toLowerCase() === "true") {
    return true;
  }
  if (value.toLowerCase() === "false") {
    return false;
  }
  throw new Error(`Environment variable "${name}" must be "true" or "false".`);
}

const testEnvironment = process.env.TEST_ENV?.trim() || "qa";
const environmentFile = path.resolve(__dirname, `.env.${testEnvironment}`);

if (!existsSync(environmentFile)) {
  throw new Error(
    `Environment file not found: ${environmentFile}. Set TEST_ENV to "qa" or "uat".`,
  );
}

const dotenvResult = dotenv.config({ path: environmentFile });
if (dotenvResult.error) {
  throw new Error(`Could not load environment file "${environmentFile}".`, {
    cause: dotenvResult.error,
  });
}
const environmentValues = dotenv.parse(readFileSync(environmentFile));

function isBrowserName(value: string): value is BrowserName {
  return value === "chromium" || value === "firefox" || value === "webkit";
}

const browserValue = process.env.BROWSER?.trim() || "chromium";
if (!isBrowserName(browserValue)) {
  throw new Error(
    `Unsupported BROWSER "${browserValue}". Use chromium, firefox, or webkit.`,
  );
}

const timeout = Number(process.env.TIMEOUT_MS || 30_000);
if (!Number.isInteger(timeout) || timeout <= 0) {
  throw new Error('Environment variable "TIMEOUT_MS" must be a positive integer.');
}

export const frameworkConfig = {
  baseUrl: requiredEnvironmentValue("BASE_URL"),
  username:
    process.env.TEST_USERNAME?.trim() ||
    environmentValues.USERNAME ||
    requiredEnvironmentValue("USERNAME"),
  password: requiredEnvironmentValue("PASSWORD"),
  invalidUsername: requiredEnvironmentValue("INVALID_USERNAME"),
  invalidPassword: requiredEnvironmentValue("INVALID_PASSWORD"),
  browser: browserValue,
  headless: parseBoolean("HEADLESS", process.env.HEADLESS || "true"),
  timeout,
};
