import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import { fileCreateFields, type FileCreateValidatorType } from "#src/file/convex/fileCreateMutation.ts"
import { fileDataSchema } from "#src/file/model/fileSchema.ts"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createErrorAndLogError } from "#src/utils/convex_backend/createErrorAndLogError.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
import * as a from "valibot"

export const r2FileCreateFields = fileCreateFields
export const r2FileCreateValidator = v.object(r2FileCreateFields)
export type R2FileCreateValidatorType = typeof r2FileCreateValidator.type

export const r2FileCreateMutation = mutation({
  args: createTokenValidator(r2FileCreateFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, r2FileCreateFn),
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
