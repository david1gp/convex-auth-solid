import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import type { IdWorkspace } from "@/workspace/convex/IdWorkspace"
import { workspaceDataSchemaFields } from "@/workspace/model/workspaceSchema"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
// import { nowIso } from "../../utils/nowIso"
import { authMutationResult } from "@/utils/convex_backend/authMutationResult"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { workspaceHandleAvailableFn } from "@/workspace/convex/workspaceHandleAvailableQuery"
import { workspaceDataSchema } from "@/workspace/model/workspaceSchema"
import * as va from "valibot"
import { createError, createResult, createResultError, type PromiseResult } from "~result"

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
