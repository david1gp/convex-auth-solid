import { workspaceDataSchema } from "@/workspace/model/workspaceSchema"
import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as va from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocWorkspace } from "./IdWorkspace"

export type WorkspaceEditValidatorType = typeof workspaceEditValidator.type

export const workspaceEditFields = {
  workspaceHandle: v.string(),
  // data
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  url: v.optional(v.string()),
} as const

export const workspaceEditValidator = v.object(workspaceEditFields)

export async function workspaceEditFn(ctx: MutationCtx, args: WorkspaceEditValidatorType): PromiseResult<null> {
  const op = "workspaceEditFn"

  const schema = va.partial(workspaceDataSchema)
  const parse = va.safeParse(schema, args)
  if (!parse.success) {
    return createResultError(op, va.summarize(parse.issues))
  }

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }
  const { workspaceHandle, ...partial } = args
  const patch: Partial<DocWorkspace> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch(workspace._id, patch)
  return createResult(null)
}
