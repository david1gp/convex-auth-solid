import { expect, test } from "bun:test"
import { oidcZitadelRoleGet } from "#src/auth/server/oidc/oidcZitadelRoleGet.ts"

const organizationId = "380716752838852623"

test("Zitadel roles map trusted organization claims to canonical roles", () => {
  expect(
    oidcZitadelRoleGet(
      [{ user: { [organizationId]: "contentoren.example" } }, { admin: { [organizationId]: "contentoren.example" } }],
      organizationId,
    ),
  ).toBe("admin")
  expect(oidcZitadelRoleGet([{ admin: { [organizationId]: "contentoren.example" } }], organizationId)).toBe("admin")
  expect(oidcZitadelRoleGet([{ user: { [organizationId]: "contentoren.example" } }], organizationId)).toBe("user")
  expect(oidcZitadelRoleGet([{ admin: { other: "other.example" } }], organizationId)).toBe("user")
})
