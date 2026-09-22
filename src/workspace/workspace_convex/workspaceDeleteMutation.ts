import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx, mutation } from "#convex/_generated/server.js"
import { authMutationWrapResult } from "#src/utils/convex_backend/authMutationWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"

export type WorkspaceDeleteValidatorType = typeof workspaceDeleteValidator.type

export const workspaceDeleteFields = valibotToConvex({ workspaceHandle: a.string() })

export const workspaceDeleteValidator = v.object(workspaceDeleteFields)

export const workspaceDeleteMutation = mutation({
  args: createTokenValidator(workspaceDeleteFields),
  handler: async (ctx, args) => authMutationWrapResult(ctx, args, workspaceDeleteFn),
})

export const workspaceDeleteInternal = internalMutation({
  args: workspaceDeleteValidator,
  handler: workspaceDeleteFn,
})

export async function workspaceDeleteFn(ctx: MutationCtx, args: WorkspaceDeleteValidatorType): Promise<null> {
  const ws = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!ws) return null // idempotent
  await ctx.db.delete("workspaces", ws._id)
  return null
}
