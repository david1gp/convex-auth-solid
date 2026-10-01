import convex from "@convex-dev/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

const backendFiles = [
  "convex/**/*.ts",
  "src/**/convex/**/*.ts",
  "src/**/*_convex/**/*.ts",
  "src/utils/convex_backend/**/*.ts",
  "src/file/kv/**/*.ts",
]

export default [
  {
    ignores: [
      "**/_generated/**",
      "**/node_modules/**",
      "**/build/**",
      "**/dist/**",
      "**/out/**",
      "**/coverage/**",
      "**/.cache/**",
      "**/.convex/**",
      "**/.wrangler/**",
    ],
  },
  ...convex.configs.recommended.map((config) => ({
    ...config,
    files: backendFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),
]
