import { expect, test } from "bun:test"
import { oidcZitadelRoleGet } from "#src/auth/server/oidc/oidcZitadelRoleGet.ts"

const organizationId = "380716752838852623"

test("Zitadel roles use trusted organization filtering and dev-admin-user precedence", () => {
  expect(
    oidcZitadelRoleGet(
      [
        { user: { [organizationId]: "contentoren.example" } },
        { admin: { [organizationId]: "contentoren.example" } },
        { dev: { [organizationId]: "contentoren.example" } },
      ],
      organizationId,
    ),
  ).toBe("dev")
  expect(oidcZitadelRoleGet([{ user: { [organizationId]: "contentoren.example" } }], organizationId)).toBe("user")
  expect(oidcZitadelRoleGet([{ admin: { other: "other.example" } }], organizationId)).toBe("user")
})
