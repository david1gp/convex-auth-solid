import { expect, test } from "bun:test"
import type { MutationCtx } from "#convex/_generated/server.js"
import { otpCleanupOldFn } from "./otpsCleanupOldMutation.ts"

test("OTP cleanup deletes at most one bounded batch and preserves its return shape", async () => {
  const oldCodes = Array.from({ length: 101 }, (_, index) => ({ _id: `otp-${index}` }))
  let requestedLimit = 0
  const deleted: string[] = []
  const query = {
    filter: () => query,
    take: async (limit: number) => {
      requestedLimit = limit
      return oldCodes.slice(0, limit)
    },
  }
  const ctx = {
    db: {
      query: () => query,
      delete: async (_table: "authOtps", id: string) => {
        deleted.push(id)
      },
    },
  } as unknown as MutationCtx

  const result = await otpCleanupOldFn(ctx)

  expect(requestedLimit).toBe(100)
  expect(deleted).toHaveLength(100)
  expect(result).toEqual({ deleted: 100 })
})
