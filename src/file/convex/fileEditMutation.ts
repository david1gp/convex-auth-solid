import { languageOrNoneValidator } from "@/app/i18n/language"
import { fileGetByIdFn } from "@/file/convex/fileGetByIdFn"
import type { DocFile } from "@/file/convex/IdFile"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createErrorAndLogWarn } from "@/utils/convex_backend/createErrorAndLogWarn"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, type PromiseResult } from "~utils/result/Result"

export type FileEditValidatorType = typeof fileEditValidator.type

export const fileEditFields = {
  fileId: v.string(),
  // data
  displayName: v.optional(v.string()),
  language: v.optional(languageOrNoneValidator),
} as const

export const fileEditValidator = v.object(fileEditFields)

export const fileEditMutation = mutation({
  args: createTokenValidator(fileEditFields),
  handler: async (ctx, args) => authMutationR(ctx, args, fileEditFn),
})

export const fileEditInternalMutation = internalMutation({
  args: fileEditValidator,
  handler: fileEditFn,
})

export async function fileEditFn(ctx: MutationCtx, args: FileEditValidatorType): PromiseResult<null> {
  const op = "fileEditFn"

  const file = await fileGetByIdFn(ctx, args.fileId)
  if (!file) {
    return createErrorAndLogWarn(op, "File not found", args.fileId)
  }

  const { fileId, ...partial } = args
  const patch: Partial<DocFile> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch("files", file._id, patch)
  return createResult(null)
}
