import { globSync } from "glob"

export function e2eSuitePathsGet(root = "."): string[] {
  return globSync("e2e/workflows/**/*.test.ts", { cwd: root }).sort()
}
