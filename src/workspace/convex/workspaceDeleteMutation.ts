import { type MutationCtx, internalMutation, mutation } from "@convex/_generated/server"
import { authMutation } from "@convex/utils/authMutation"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"

export type WorkspaceDeleteValidatorType = typeof workspaceDeleteValidator.type

export const workspaceDeleteFields = {
  workspaceHandle: v.string(),
} as const

export const workspaceDeleteValidator = v.object(workspaceDeleteFields)

export const workspaceDeleteMutation = mutation({
  args: createTokenValidator(workspaceDeleteFields),
  handler: async (ctx, args) => authMutation(ctx, args, workspaceDeleteFn),
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
  await ctx.db.delete(ws._id)
  return null
}
