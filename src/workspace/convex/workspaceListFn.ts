import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type WorkspaceListValidatorType = typeof workspaceListValidator.type

export const workspaceListFields = {
  // orgHandle: v.string(), // TODO list workspaces by org
} as const

export const workspaceListValidator = v.object(workspaceListFields)

export async function workspaceListFn(ctx: QueryCtx, args: WorkspaceListValidatorType): Promise<DocWorkspace[]> {
  return await ctx.db.query("workspaces").collect()
}
