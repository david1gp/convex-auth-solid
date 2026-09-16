import { v } from "convex/values"
import { internalQuery, type QueryCtx, query } from "#convex/_generated/server.js"
import { fileDocToModel } from "#src/file/convex/fileDocToModel.ts"
import type { FileModel } from "#src/file/model/FileModel.ts"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { paginationDefaultOptions } from "#src/utils/convex_backend/paginationDefaultOptions.ts"
import { paginationOptsValidator } from "#src/utils/convex_backend/paginationOptsValidator.ts"
import { paginationResultMap } from "#src/utils/convex_backend/paginationResultMap.ts"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"

export type FileListValidatorType = typeof fileListValidator.type

export const fileListFields = {
  paginationOpts: paginationOptsValidator,
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

export async function fileListFn(ctx: QueryCtx, args: FileListValidatorType): Promise<PaginationResultType<FileModel>> {
  const docs = await ctx.db.query("files").paginate(args.paginationOpts ?? paginationDefaultOptions)
  return paginationResultMap(docs, fileDocToModel)
}
