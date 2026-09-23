import { expect, test } from "bun:test"
import type { ActionCtx } from "#convex/_generated/server.js"
import { signInUsingSocialAuth1RequestHandler } from "#src/auth/convex/sign_in_social/signInUsingSocialAuth1RequestHandler.ts"
import { loginProvider } from "#src/auth/model_field/socialLoginProvider.ts"

test("the admin provider remains gated to development environments", async () => {
  const previousEnvMode = process.env.PUBLIC_ENV_MODE
  const ctx = {} as ActionCtx
  try {
    process.env.PUBLIC_ENV_MODE = "production"
    const disabledResponse = await signInUsingSocialAuth1RequestHandler(
      loginProvider.admin,
      ctx,
      new Request("https://example.com/api/auth/admin"),
    )
    expect(disabledResponse.status).toBe(400)
    expect(await disabledResponse.text()).toContain("Admin provider disabled")

    process.env.PUBLIC_ENV_MODE = "development"
    const enabledResponse = await signInUsingSocialAuth1RequestHandler(
      loginProvider.admin,
      ctx,
      new Request("https://example.com/api/auth/admin"),
    )
    expect(enabledResponse.status).toBe(400)
    expect(await enabledResponse.text()).toContain("missing code")
  } finally {
    if (previousEnvMode === undefined) delete process.env.PUBLIC_ENV_MODE
    else process.env.PUBLIC_ENV_MODE = previousEnvMode
  }
})
