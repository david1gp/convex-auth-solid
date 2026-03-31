import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import { vIdUser } from "#src/auth/convex/vIdUser.ts"
import type { IdFile } from "#src/file/convex/IdFile.ts"
import { fileDataSchema, fileSchemaFields } from "#src/file/model/fileSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createErrorAndLogError } from "#src/utils/convex_backend/createErrorAndLogError.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
import * as a from "valibot"

const fileMetaDataSchemaFields = {
  fileId: stringSchemaId,
  username: a.optional(stringSchemaId),
} as const

const fileTableDataSchemaFields = {
  ...fileMetaDataSchemaFields,
  ...fileSchemaFields,
} as const

export const fileCreateFields = {
  userId: vIdUser,
  ...valibotToConvex(fileTableDataSchemaFields),
}
export const fileCreateValidator = v.object(fileCreateFields)
export type FileCreateValidatorType = typeof fileCreateValidator.type

export const fileCreateMutation = mutation({
  args: createTokenValidator(fileCreateFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, fileCreateFn),
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
