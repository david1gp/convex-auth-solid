import { createResult, type PromiseResult } from "#result"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"

export const workspaceHandleAvailableFields = {
  workspaceHandle: v.string(),
} as const

export type WorkspaceHandleAvailableValidatorType = typeof workspaceHandleAvailableValidator.type
export const workspaceHandleAvailableValidator = v.object(workspaceHandleAvailableFields)

export const workspaceHandleAvailable = query({
  args: createTokenValidator(workspaceHandleAvailableFields),
  handler: async (ctx, args) => authQueryResult(ctx, args, workspaceHandleAvailableFn),
})

export const workspaceHandleAvailableInternal = internalQuery({
  args: workspaceHandleAvailableValidator,
  handler: workspaceHandleAvailableFn,
})

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
