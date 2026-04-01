import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import type { IdWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"
import { workspaceDataSchemaFields } from "#src/workspace/workspace_model/workspaceSchema.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
// import { nowIso } from "../../utils/nowIso.js"
import { createError, createResult, createResultError, type PromiseResult } from "#result"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { workspaceHandleAvailableFn } from "#src/workspace/workspace_convex/workspaceHandleAvailableQuery.ts"
import { workspaceDataSchema } from "#src/workspace/workspace_model/workspaceSchema.ts"
import * as va from "valibot"

export type WorkspaceCreateValidatorType = typeof workspaceCreateValidator.type

export const workspaceCreateFields = valibotToConvex(workspaceDataSchemaFields)

export const workspaceCreateValidator = v.object(workspaceCreateFields)

export const workspaceCreateMutation = mutation({
  args: createTokenValidator(workspaceCreateFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, workspaceCreateFn),
})

export const workspaceCreateInternal = internalMutation({
  args: workspaceCreateValidator,
  handler: workspaceCreateFn,
})

export async function workspaceCreateFn(
  ctx: MutationCtx,
  args: WorkspaceCreateValidatorType,
): PromiseResult<IdWorkspace> {
  const op = "workspaceCreateFn"

  const parse = va.safeParse(workspaceDataSchema, args)
  if (!parse.success) {
    return createResultError(op, va.summarize(parse.issues))
  }

  const handleAvailableResult = await workspaceHandleAvailableFn(ctx, { workspaceHandle: args.workspaceHandle })
  if (!handleAvailableResult.success) return handleAvailableResult
  if (!handleAvailableResult.data) {
    const errorMessage = "Handle not available, please try a different one"
    return createError(op, errorMessage, args.workspaceHandle)
  }

  const now = nowIso()
  const workspaceId = await ctx.db.insert("workspaces", {
    ...args,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(workspaceId)
}
