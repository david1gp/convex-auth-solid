import { expect, test } from "bun:test"
import { createUserFromAuthProviderFn } from "#src/auth/convex/crud/createUserFromAuthProviderMutation.ts"
import { findOrCreateUserFn } from "#src/auth/convex/crud/findOrCreateUserFn.ts"
import type { UserRole } from "#src/auth/model_field/userRole.ts"

test("OIDC role synchronization upgrades and downgrades an existing user on each login", async () => {
  const user = {
    _id: "user-1",
    _creationTime: Date.now(),
    name: "Ada User",
    image: "",
    email: "ada@example.test",
    role: "user" as UserRole,
    createdAt: "2026-09-22T00:00:00.000Z",
    updatedAt: "2026-09-22T00:00:00.000Z",
  }
  const account = {
    _id: "account-1",
    _creationTime: Date.now(),
    userId: user._id,
    provider: "oidc" as const,
    issuer: "https://issuer.example",
    providerAccountId: "subject-1",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
  const rows = { users: [user], authAccounts: [account], orgMembers: [] as unknown[] }
  const ctx = {
    db: {
      query(table: keyof typeof rows) {
        const builder = {
          withIndex(_name: string, callback: (query: { eq: (field: string, value: unknown) => unknown }) => unknown) {
            const query = { eq: () => query }
            callback(query)
            return builder
          },
          unique: async () => (table === "authAccounts" ? rows.authAccounts[0] : null),
          first: async () => null,
        }
        return builder
      },
      get: async (table: keyof typeof rows) => (table === "users" ? rows.users[0] : null),
      patch: async (_table: "users", _id: string, value: Partial<typeof user>) => Object.assign(user, value),
    },
  } as never
  const provider = {
    provider: "oidc" as const,
    issuer: account.issuer,
    providerId: account.providerAccountId,
    givenName: "Ada",
    familyName: "User",
    image: "",
    username: "ada",
    role: "admin" as const,
  }

  const upgrade = await findOrCreateUserFn(ctx, provider)
  expect(upgrade.success).toBe(true)
  expect(user.role).toBe("admin")
  if (upgrade.success) expect(upgrade.data.profile.role).toBe("admin")

  const downgrade = await findOrCreateUserFn(ctx, { ...provider, role: "user" })
  expect(downgrade.success).toBe(true)
  expect(user.role).toBe("user")
  if (downgrade.success) expect(downgrade.data.profile.role).toBe("user")
})

test("OIDC role synchronization assigns a configured role to a new user", async () => {
  const rows = { users: [] as Record<string, unknown>[], authAccounts: [] as Record<string, unknown>[] }
  const ctx = {
    db: {
      query(_table: keyof typeof rows) {
        const builder = {
          withIndex(_name: string, callback: (query: { eq: (field: string, value: unknown) => unknown }) => unknown) {
            const query = { eq: () => query }
            callback(query)
            return builder
          },
          unique: async () => null,
        }
        return builder
      },
      insert: async (table: keyof typeof rows, value: Record<string, unknown>) => {
        const row = { ...value, _id: `${table}-1`, _creationTime: Date.now() }
        rows[table].push(row)
        return row._id
      },
    },
  } as never

  const result = await createUserFromAuthProviderFn(ctx, {
    provider: "oidc",
    issuer: "https://issuer.example",
    providerId: "subject-2",
    givenName: "Grace",
    familyName: "Hopper",
    image: "",
    username: "grace",
    role: "dev",
  })

  expect(result.success).toBe(true)
  expect(rows.users[0]?.role).toBe("dev")
  if (result.success) expect(result.data.role).toBe("dev")
})
