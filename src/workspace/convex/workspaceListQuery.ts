import { type QueryCtx, internalQuery, query } from "#convex/_generated/server.js"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import type { DocWorkspace } from "#src/workspace/convex/IdWorkspace.ts"
import { v } from "convex/values"

export type WorkspaceListValidatorType = typeof workspaceListValidator.type

export const workspaceListFields = {
  // orgHandle: v.string(), // TODO list workspaces by org
} as const

export const workspaceListValidator = v.object(workspaceListFields)

export const workspacesListQuery = query({
  args: createTokenValidator(workspaceListFields),
  handler: async (ctx, args) => authQueryWrapResult(ctx, args, workspaceListFn),
})

export const workspaceListInternal = internalQuery({
  args: workspaceListValidator,
  handler: workspaceListFn,
})

export async function workspaceListFn(ctx: QueryCtx, args: WorkspaceListValidatorType): Promise<DocWorkspace[]> {
  return await ctx.db.query("workspaces").collect()
}
