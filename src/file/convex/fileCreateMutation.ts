import { vIdUser } from "@/auth/convex/vIdUser"
import type { IdFile } from "@/file/convex/IdFile"
import { fileDataSchema, fileSchemaFields } from "@/file/model/fileSchema"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { authMutationResult } from "@/utils/convex_backend/authMutationResult"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { stringSchemaId } from "@/utils/valibot/stringSchema"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { createResult, type PromiseResult } from "~result"
import { nowIso } from "~utils/date/nowIso"

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
