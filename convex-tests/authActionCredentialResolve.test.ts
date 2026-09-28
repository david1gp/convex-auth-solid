import { expect, test } from "vitest"
import { createResult } from "#result"
import { authActionCredentialResolve } from "../src/utils/convex_backend/authActionCredentialResolve.ts"

test("action credential resolution rejects a cached API key result once its expiry passes", async () => {
  const ctx = {
    runQuery: async () =>
      createResult({
        kind: "apiKey" as const,
        userId: "users:cached" as never,
        expiresAt: new Date(Date.now() - 1).toISOString(),
      }),
  }

  const result = await authActionCredentialResolve(ctx as never, "credential")

  expect(result.success).toBe(false)
  if (!result.success) expect(result.errorMessage).toBe("expired credential")
})
