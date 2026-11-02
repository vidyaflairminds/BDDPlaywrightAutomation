import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

// Cucumber CLI executes the scenarios; this wrapper adds consistent reporting and headed mode.
const forwardedArguments = process.argv.slice(2);
const cucumberArguments: string[] = [];

for (const argument of forwardedArguments) {
  if (argument === "--headed") {
    process.env.HEADLESS = "false";
  } else {
    cucumberArguments.push(argument);
  }
}

const cucumberPackageJson = require.resolve("@cucumber/cucumber/package.json");
const cucumberCliPath = path.join(
  path.dirname(cucumberPackageJson),
  "bin",
  "cucumber.js",
);
const result = spawnSync(
  process.execPath,
  [cucumberCliPath, ...cucumberArguments],
  {
    stdio: "inherit",
    env: process.env,
  },
);

if (result.error) {
  console.error("Could not start the Cucumber CLI:", result.error);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
