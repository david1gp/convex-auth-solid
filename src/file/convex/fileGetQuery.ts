import { fileDocToModel } from "@/file/convex/fileDocToModel"
import { fileGetByIdFn } from "@/file/convex/fileGetByIdFn"
import type { FileModel } from "@/file/model/FileModel"
import { authQueryR } from "@/utils/convex_backend/authQueryR"
import { createErrorAndLogWarn } from "@/utils/convex_backend/createErrorAndLogWarn"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const fileGetFields = {
  fileId: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type FileGetValidatorType = typeof fileGetValidator.type
export const fileGetValidator = v.object(fileGetFields)

export const fileGetQuery = query({
  args: createTokenValidator(fileGetFields),
  handler: async (ctx, args) => authQueryR(ctx, args, fileGetFn),
})

export const fileGetInternalQuery = internalQuery({
  args: fileGetValidator,
  handler: fileGetFn,
})

export async function fileGetFn(ctx: QueryCtx, args: FileGetValidatorType): PromiseResult<FileModel | null> {
  const op = "fileGetFn"

  const file = await fileGetByIdFn(ctx, args.fileId)
  if (!file) {
    return createErrorAndLogWarn(op, "File not found", args.fileId)
  }
  if (args.updatedAt && args.updatedAt === file.updatedAt) {
    return createResult(null)
  }
  return createResult(fileDocToModel(file))
}
