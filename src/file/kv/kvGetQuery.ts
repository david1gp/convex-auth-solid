import { internalQuery, query, type MutationCtx, type QueryCtx } from "#convex/_generated/server.js"
import type { DocKv } from "#src/file/kv/IdKv.ts"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { v } from "convex/values"

export const kvGetFields = {
  key: v.string(),
} as const

export type KvGetType = typeof kvGetValidator.type
export const kvGetValidator = v.object(kvGetFields)

export const kvGetQuery = query({
  args: createTokenValidator(kvGetFields),
  handler: async (ctx: QueryCtx, args) => {
    return authQueryWrapResult(ctx, args, kvGetQueryFn)
  },
})

export const kvGetInternalQuery = internalQuery({
  args: kvGetValidator,
  handler: kvGetQueryFn,
})

export async function kvGetQueryFn(ctx: QueryCtx | MutationCtx, args: KvGetType): Promise<DocKv | null> {
  return kvGetQueryFn2(ctx, args.key)
}

export async function kvGetQueryFn2(ctx: QueryCtx | MutationCtx, key: string): Promise<DocKv | null> {
  return await ctx.db
    .query("kv")
    .withIndex("byKey", (q) => q.eq("key", key))
    .unique()
}
