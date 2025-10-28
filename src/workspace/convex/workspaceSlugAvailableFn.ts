import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"
import type { DocWorkspace } from "./IdWorkspace"

export const workspaceSlugAvailableFields = {
  workspaceSlug: v.string(),
} as const

export type WorkspaceSlugAvailableValidatorType = typeof workspaceSlugAvailableValidator.type
export const workspaceSlugAvailableValidator = v.object(workspaceSlugAvailableFields)

export async function workspaceSlugAvailableFn(
  ctx: QueryCtx,
  args: WorkspaceSlugAvailableValidatorType,
): PromiseResult<boolean> {
  const op = "workspaceSlugAvailableFn"
  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("slug", (q) => q.eq("slug", args.workspaceSlug))
    .unique()
  if (workspace) {
    return createResult(false)
  }
  return createResult(true)
}