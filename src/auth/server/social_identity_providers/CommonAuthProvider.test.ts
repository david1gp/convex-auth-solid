import { expect, test } from "bun:test"
import * as a from "valibot"
import { commonAuthProviderSchema } from "#src/auth/server/social_identity_providers/CommonAuthProvider.ts"

const providerWithoutEmail = {
  provider: "dev",
  providerId: "dev-user",
  givenName: "Dev",
  familyName: "User",
  image: "",
  username: "",
}

test("social provider profiles may omit an unavailable email", () => {
  const result = a.safeParse(commonAuthProviderSchema, providerWithoutEmail)

  expect(result.success).toBe(true)
})

test("social provider profiles do not treat an empty email as valid", () => {
  const result = a.safeParse(commonAuthProviderSchema, { ...providerWithoutEmail, email: "" })

  expect(result.success).toBe(false)
})
