import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocWorkspace } from "./IdWorkspace"

export const workspaceGetFields = {
  workspaceHandle: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type WorkspaceGetValidatorType = typeof workspaceGetValidator.type
export const workspaceGetValidator = v.object(workspaceGetFields)

export const workspaceGetQuery = query({
  args: createTokenValidator(workspaceGetFields),
  handler: async (ctx, args) => authQueryR(ctx, args, workspaceGetFn),
})

export const workspaceGetInternal = internalQuery({
  args: workspaceGetValidator,
  handler: workspaceGetFn,
})

export async function workspaceGetFn(
  ctx: QueryCtx,
  args: WorkspaceGetValidatorType,
): PromiseResult<DocWorkspace | null> {
  const op = "workspaceGetFn"
  let workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }
  if (args.updatedAt && args.updatedAt === workspace.updatedAt) {
    return createResult(null)
  }
  return createResult(workspace)
}
