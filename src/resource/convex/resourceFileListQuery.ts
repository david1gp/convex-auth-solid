import { fileDocToModel } from "@/file/convex/fileDocToModel"
import { fileGetByIdFn } from "@/file/convex/fileGetByIdFn"
import type { FileModel } from "@/file/model/FileModel"
import { authQuery } from "@/utils/convex_backend/authQuery"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { notEmptyFilter } from "~utils/arr/notEmptyFilter"

export type ResourceFileListValidatorType = typeof resourceFileListValidator.type

export const resourceFileListFields = {
  resourceId: v.string(),
} as const

export const resourceFileListValidator = v.object(resourceFileListFields)

export const resourceFileListQuery = query({
  args: createTokenValidator(resourceFileListFields),
  handler: async (ctx, args) => authQuery(ctx, args, resourceFileListFn),
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
