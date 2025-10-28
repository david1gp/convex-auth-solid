import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocWorkspace } from "./IdWorkspace"

export const workspaceGetFields = {
  workspaceSlug: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type WorkspaceGetValidatorType = typeof workspaceGetValidator.type
export const workspaceGetValidator = v.object(workspaceGetFields)

export async function workspaceGetFn(
  ctx: QueryCtx,
  args: WorkspaceGetValidatorType,
): PromiseResult<DocWorkspace | null> {
  const op = "workspaceGetFn"
  let workspace = await ctx.db
    .query("workspaces")
    .withIndex("slug", (q) => q.eq("slug", args.workspaceSlug))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceSlug)
  }
  if (args.updatedAt && args.updatedAt === workspace.updatedAt) {
    return createResult(null)
  }
  return createResult(workspace)
}
