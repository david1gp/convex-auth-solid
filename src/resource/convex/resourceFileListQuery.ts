import { internalQuery, query, type QueryCtx } from "#convex/_generated/server.js"
import { fileDocToModel } from "#src/file/convex/fileDocToModel.ts"
import { fileGetByIdFn } from "#src/file/convex/fileGetByIdFn.ts"
import type { FileModel } from "#src/file/model/FileModel.ts"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { notEmptyFilter } from "#utils/arr/notEmptyFilter.js"
import { v } from "convex/values"

export type ResourceFileListValidatorType = typeof resourceFileListValidator.type

export const resourceFileListFields = {
  resourceId: v.string(),
} as const

export const resourceFileListValidator = v.object(resourceFileListFields)

export const resourceFileListQuery = query({
  args: createTokenValidator(resourceFileListFields),
  handler: async (ctx, args) => authQueryWrapResult(ctx, args, resourceFileListFn),
})

export const resourceFileListInternalQuery = internalQuery({
  args: resourceFileListValidator,
  handler: resourceFileListFn,
})

export async function resourceFileListFn(ctx: QueryCtx, args: ResourceFileListValidatorType): Promise<FileModel[]> {
  const list = await ctx.db
    .query("resourceFiles")
    .withIndex("resourceId", (q) => q.eq("resourceId", args.resourceId))
    .collect()
  const all = await Promise.all(list.map((mr) => fileGetByIdFn(ctx, mr.fileId)))
  const filtered = all.filter(notEmptyFilter)
  return filtered.map(fileDocToModel)
}
