import { fileCreateFields, type FileCreateValidatorType } from "@/file/convex/fileCreateMutation"
import { fileDataSchema } from "@/file/model/fileSchema"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const r2FileCreateFields = fileCreateFields
export const r2FileCreateValidator = v.object(r2FileCreateFields)
export type R2FileCreateValidatorType = typeof r2FileCreateValidator.type

export const r2FileCreateMutation = mutation({
  args: createTokenValidator(r2FileCreateFields),
  handler: async (ctx, args) => authMutationR(ctx, args, r2FileCreateFn),
})

export const r2FileCreateInternalMutation = internalMutation({
  args: r2FileCreateValidator,
  handler: r2FileCreateFn,
})

export async function r2FileCreateFn(ctx: MutationCtx, args: FileCreateValidatorType): PromiseResult<null> {
  const op = "r2FileCreateFn"

  const parse = a.safeParse(fileDataSchema, args)
  if (!parse.success) {
    return createErrorAndLogError(op, a.summarize(parse.issues))
  }

  const now = nowIso()
  const id = await ctx.db.insert("files", {
    ...args,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(null)
}
