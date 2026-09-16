import { v } from "convex/values"
import { internalQuery, type QueryCtx, query } from "#convex/_generated/server.js"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { paginationDefaultOptions } from "#src/utils/convex_backend/paginationDefaultOptions.ts"
import { paginationOptsValidator } from "#src/utils/convex_backend/paginationOptsValidator.ts"
import { paginationResultMap } from "#src/utils/convex_backend/paginationResultMap.ts"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import type { DocWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"

export type WorkspaceListValidatorType = typeof workspaceListValidator.type

export const workspaceListFields = {
  // orgHandle: v.string(), // TODO list workspaces by org
  paginationOpts: paginationOptsValidator,
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

export async function workspaceListFn(
  ctx: QueryCtx,
  args: WorkspaceListValidatorType,
): Promise<PaginationResultType<DocWorkspace>> {
  const result = await ctx.db.query("workspaces").paginate(args.paginationOpts ?? paginationDefaultOptions)
  return paginationResultMap(result, (workspace) => workspace)
}
