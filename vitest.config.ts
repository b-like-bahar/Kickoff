import { defineConfig } from "vitest/config";
// TODO: Uncomment the following imports when Storybook supports Next.js 16
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";

// Vitest config - ready for use when needed
// Storybook-related configuration has been removed since Storybook is not compatible with Next.js 16
export default defineConfig({
  // Add your Vitest configuration here when needed
  // TODO: Uncomment the following configuration when Storybook supports Next.js 16
  // const dirname =
  //   typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
  //
  // More info at: https://storybook.js.org/docs/writing-tests/test-addon
  // test: {
  //   workspace: [
  //     {
  //       extends: true,
  //       plugins: [
  //         // The plugin will run tests for the stories defined in your Storybook config
  //         // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
  //         storybookTest({ configDir: path.join(dirname, ".storybook") }),
  //       ],
  //       test: {
  //         name: "storybook",
  //         browser: {
  //           enabled: true,
  //           headless: true,
  //           name: "chromium",
  //           provider: "playwright",
  //         },
  //         setupFiles: [".storybook/vitest.setup.ts"],
  //       },
  //     },
  //   ],
  // },
});
