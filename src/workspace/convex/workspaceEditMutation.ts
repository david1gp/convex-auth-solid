import { workspaceDataSchema } from "@/workspace/model/workspaceSchema"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { v } from "convex/values"
import * as va from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocWorkspace } from "./IdWorkspace"

export type WorkspaceEditValidatorType = typeof workspaceEditValidator.type

export const workspaceEditValidator = v.object({
  workspaceHandle: v.string(),
  // data
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  url: v.optional(v.string()),
}).partial()

export const workspaceEditMutation = mutation({
  args: createTokenValidator(workspaceEditValidator.fields),
  handler: async (ctx, args) => authMutationR(ctx, args, workspaceEditFn),
})

export const workspaceEditInternal = internalMutation({
  args: workspaceEditValidator,
  handler: workspaceEditFn,
})

export async function workspaceEditFn(ctx: MutationCtx, args: WorkspaceEditValidatorType): PromiseResult<null> {
  const op = "workspaceEditFn"
  const { workspaceHandle, ...partial } = args

  if (!workspaceHandle) {
    return createResultError(op, "Missing workspaceHandle")
  }

  const schema = va.partial(workspaceDataSchema)
  const parse = va.safeParse(schema, partial)
  if (!parse.success) {
    return createResultError(op, va.summarize(parse.issues))
  }

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", workspaceHandle)
  }
  const patch: Partial<DocWorkspace> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch("workspaces", workspace._id, patch)
  return createResult(null)
}
