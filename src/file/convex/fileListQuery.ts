import { fileDocToModel } from "@/file/convex/fileDocToModel"
import type { FileModel } from "@/file/model/FileModel"
import { authQuery } from "@/utils/convex_backend/authQuery"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type FileListValidatorType = typeof fileListValidator.type

export const fileListFields = {
  // Add filtering options here if needed
} as const

export const fileListValidator = v.object(fileListFields)

export const filesListQuery = query({
  args: createTokenValidator(fileListFields),
  handler: async (ctx, args) => authQuery(ctx, args, fileListFn),
})

export const filesListInternalQuery = internalQuery({
  args: fileListValidator,
  handler: fileListFn,
})

export async function fileListFn(ctx: QueryCtx, _args: FileListValidatorType): Promise<FileModel[]> {
  const docs = await ctx.db.query("files").collect()
  return docs.map(fileDocToModel)
}
