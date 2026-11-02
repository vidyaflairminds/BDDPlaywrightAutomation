import type { LaunchOptions } from "playwright";
import { frameworkConfig } from "./config/config";

// These are browser-library defaults only; Cucumber remains the scenario test runner.
export const playwrightConfig: {
  baseURL: string;
  timeout: number;
  launchOptions: LaunchOptions;
} = {
  baseURL: frameworkConfig.baseUrl,
  timeout: frameworkConfig.timeout,
  launchOptions: {
    headless: frameworkConfig.headless,
  },
};
