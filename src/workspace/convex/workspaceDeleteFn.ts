import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type WorkspaceDeleteValidatorType = typeof workspaceDeleteValidator.type

export const workspaceDeleteFields = {
  workspaceHandle: v.string(),
} as const

export const workspaceDeleteValidator = v.object(workspaceDeleteFields)

export async function workspaceDeleteFn(ctx: MutationCtx, args: WorkspaceDeleteValidatorType): Promise<null> {
  const ws = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!ws) return null // idempotent
  await ctx.db.delete(ws._id)
  return null
}
