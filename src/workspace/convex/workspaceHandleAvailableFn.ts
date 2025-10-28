import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const workspaceHandleAvailableFields = {
  workspaceHandle: v.string(),
} as const

export type WorkspaceHandleAvailableValidatorType = typeof workspaceHandleAvailableValidator.type
export const workspaceHandleAvailableValidator = v.object(workspaceHandleAvailableFields)

export async function workspaceHandleAvailableFn(
  ctx: QueryCtx,
  args: WorkspaceHandleAvailableValidatorType,
): PromiseResult<boolean> {
  const op = "workspaceHandleAvailableFn"
  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (workspace) {
    return createResult(false)
  }
  return createResult(true)
}
