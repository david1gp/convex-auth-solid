import { defineConfig } from "@rstest/core"
import { definePlaywrightConfig } from "@rstest/playwright/config"

export default defineConfig({
  extends: definePlaywrightConfig({}),
  include: ["e2e/workflows/**/*.test.ts"],
  testEnvironment: "node",
  isolate: false,
})
