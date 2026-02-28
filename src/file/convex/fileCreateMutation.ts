import { fileUploadedFields } from "@/file/convex/fileTables"
import type { IdFile } from "@/file/convex/IdFile"
import { fileDataSchema } from "@/file/model/fileSchema"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const fileCreateFields = fileUploadedFields
export const fileCreateValidator = v.object(fileCreateFields)
export type FileCreateValidatorType = typeof fileCreateValidator.type

export const fileCreateMutation = mutation({
  args: createTokenValidator(fileCreateFields),
  handler: async (ctx, args) => authMutationR(ctx, args, fileCreateFn),
})

export const fileCreateInternalMutation = internalMutation({
  args: fileCreateValidator,
  handler: fileCreateFn,
})

export async function fileCreateFn(ctx: MutationCtx, args: FileCreateValidatorType): PromiseResult<IdFile> {
  const op = "fileCreateFn"

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
  return createResult(id)
}
