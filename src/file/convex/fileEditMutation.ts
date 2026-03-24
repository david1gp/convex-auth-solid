import { createResult, type PromiseResult } from "#result"
import { languageOrNoneValidator } from "#src/app/i18n/language.js"
import { fileGetByIdFn } from "#src/file/convex/fileGetByIdFn.js"
import type { DocFile } from "#src/file/convex/IdFile.js"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.js"
import { createErrorAndLogWarn } from "#src/utils/convex_backend/createErrorAndLogWarn.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { nowIso } from "#utils/date/nowIso"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"

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
  handler: async (ctx, args) => authMutationResult(ctx, args, fileEditFn),
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
