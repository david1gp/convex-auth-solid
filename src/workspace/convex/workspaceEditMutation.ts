import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { workspaceDataSchema } from "#src/workspace/model/workspaceSchema.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
import * as va from "valibot"
import type { DocWorkspace } from "./IdWorkspace.js"

export type WorkspaceEditValidatorType = typeof workspaceEditValidator.type

export const workspaceEditValidator = v
  .object({
    workspaceHandle: v.string(),
    // data
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    url: v.optional(v.string()),
  })
  .partial()

export const workspaceEditMutation = mutation({
  args: createTokenValidator(workspaceEditValidator.fields),
  handler: async (ctx, args) => authMutationResult(ctx, args, workspaceEditFn),
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
