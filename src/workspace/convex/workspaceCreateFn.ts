import type { IdWorkspace } from "@/workspace/convex/IdWorkspace"
import { workspaceDataFields } from "@/workspace/convex/workspaceTables"
import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
// import { nowIso } from "../../utils/nowIso"
import { workspaceHandleAvailableFn } from "@/workspace/convex/workspaceHandleAvailableFn"
import { workspaceDataSchema } from "@/workspace/model/workspaceSchema"
import * as va from "valibot"
import { createError, createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type WorkspaceCreateValidatorType = typeof workspaceCreateValidator.type

export const workspaceCreateFields = workspaceDataFields

export const workspaceCreateValidator = v.object(workspaceCreateFields)

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
