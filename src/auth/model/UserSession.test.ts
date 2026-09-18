import { expect, test } from "bun:test"
import { userSessionParse } from "#src/auth/model/UserSession.ts"

test("session parsing accepts a social profile without an email", () => {
  const now = new Date().toISOString()
  const result = userSessionParse(
    "userSessionParse",
    JSON.stringify({
      token: "session-token",
      profile: {
        userId: "user-1",
        name: "Dev User",
        role: "user",
        createdAt: now,
        updatedAt: now,
      },
      hasPw: false,
      signedInMethod: "dev",
      signedInAt: now,
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    }),
  )

  expect(result.success).toBe(true)
})

test("session parsing still rejects an empty email", () => {
  const now = new Date().toISOString()
  const result = userSessionParse(
    "userSessionParse",
    JSON.stringify({
      token: "session-token",
      profile: {
        userId: "user-1",
        name: "Dev User",
        email: "",
        role: "user",
        createdAt: now,
        updatedAt: now,
      },
      hasPw: false,
      signedInMethod: "dev",
      signedInAt: now,
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    }),
  )

  expect(result.success).toBe(false)
})
