import { kvGetQueryFn2 } from "@/file/kv/kvGetQuery"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutation } from "@/utils/convex_backend/authMutation"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { v } from "convex/values"
import type { DocKv } from "./IdKv"

export type KvSetType = typeof kvSetValidator.type

export const kvSetFields = { key: v.string(), data: v.string(), updatedAt: v.optional(v.string()) } as const

export const kvSetValidator = v.object(kvSetFields)

export const kvSetMutation = mutation({
  args: createTokenValidator(kvSetFields),
  handler: async (ctx, args) => {
    return authMutation(ctx, args, kvSetMutationFn)
  },
})

export const kvSetInternalMutation = internalMutation({
  args: kvSetValidator,
  handler: kvSetMutationFn,
})

export async function kvSetMutationFn(ctx: MutationCtx, args: KvSetType): Promise<boolean | null> {
  return kvSetMutationFn2(ctx, args.key, args.data)
}

export async function kvSetMutationFn2(
  ctx: MutationCtx,
  key: string,
  data: string,
  exists?: DocKv | undefined | null,
): Promise<boolean | null> {
  // If exists is not provided, check if a document with this key exists
  let existingDoc = exists
  if (!existingDoc) {
    existingDoc = await kvGetQueryFn2(ctx, key)
  }

  if (existingDoc) {
    // Update existing document
    await ctx.db.patch("kv", existingDoc._id, {
      data: data,
      updatedAt: new Date().toISOString(),
    })
    return true
  } else {
    // Insert new document
    await ctx.db.insert("kv", {
      key,
      data,
      updatedAt: new Date().toISOString(),
    })
    return false
  }
}
