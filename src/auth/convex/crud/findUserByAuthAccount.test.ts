import { expect, test } from "bun:test"
import type { QueryCtx } from "#convex/_generated/server.js"
import { findUserByAuthAccountFn } from "#src/auth/convex/crud/findUserByAuthAccountFn.ts"

test("admin provider lookup returns the canonical account", async () => {
  const account = {
    _id: "account-1",
    _creationTime: Date.now(),
    userId: "user-1",
    provider: "admin" as const,
    providerAccountId: "admin-user",
    createdAt: "2026-09-22T00:00:00.000Z",
    updatedAt: "2026-09-22T00:00:00.000Z",
  }
  const ctx = {
    db: {
      query: () => {
        const builder = {
          withIndex: (
            _name: string,
            callback: (query: { eq: (field: string, value: string) => unknown }) => unknown,
          ) => {
            const query = { eq: () => query }
            callback(query)
            return builder
          },
          unique: async () => account,
        }
        return builder
      },
    },
  } as unknown as QueryCtx

  const result = await findUserByAuthAccountFn(ctx, {
    provider: "admin",
    providerId: "admin-user",
  })

  expect(result?._id as string).toBe(account._id)
  expect(result?.userId as string).toBe(account.userId)
  expect(result?.provider).toBe(account.provider)
  expect(result?.providerAccountId).toBe(account.providerAccountId)
})
