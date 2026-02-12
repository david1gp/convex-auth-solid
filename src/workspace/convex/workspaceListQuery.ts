import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import { type QueryCtx, internalQuery, query } from "@convex/_generated/server"
import { authQuery } from "@/utils/convex_backend/authQuery"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { v } from "convex/values"

export type WorkspaceListValidatorType = typeof workspaceListValidator.type

export const workspaceListFields = {
  // orgHandle: v.string(), // TODO list workspaces by org
} as const

export const workspaceListValidator = v.object(workspaceListFields)

export const workspacesListQuery = query({
  args: createTokenValidator(workspaceListFields),
  handler: async (ctx, args) => authQuery(ctx, args, workspaceListFn),
})

export const workspaceListInternal = internalQuery({
  args: workspaceListValidator,
  handler: workspaceListFn,
})

export async function workspaceListFn(ctx: QueryCtx, args: WorkspaceListValidatorType): Promise<DocWorkspace[]> {
  return await ctx.db.query("workspaces").collect()
}
