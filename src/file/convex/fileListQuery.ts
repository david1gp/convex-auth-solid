import { internalQuery, query, type QueryCtx } from "#convex/_generated/server.js"
import { fileDocToModel } from "#src/file/convex/fileDocToModel.js"
import type { FileModel } from "#src/file/model/FileModel.js"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { v } from "convex/values"

export type FileListValidatorType = typeof fileListValidator.type

export const fileListFields = {
  // Add filtering options here if needed
} as const

export const fileListValidator = v.object(fileListFields)

export const filesListQuery = query({
  args: createTokenValidator(fileListFields),
  handler: async (ctx, args) => authQueryWrapResult(ctx, args, fileListFn),
})

export const filesListInternalQuery = internalQuery({
  args: fileListValidator,
  handler: fileListFn,
})

export async function fileListFn(ctx: QueryCtx, _args: FileListValidatorType): Promise<FileModel[]> {
  const docs = await ctx.db.query("files").collect()
  return docs.map(fileDocToModel)
}
