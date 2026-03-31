import { internalQuery, query, type QueryCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { fileDocToModel } from "#src/file/convex/fileDocToModel.ts"
import { fileGetByIdFn } from "#src/file/convex/fileGetByIdFn.ts"
import { resourceDocToModel } from "#src/resource/convex/resourceDocToModel.ts"
import { resourceGetDocFn } from "#src/resource/convex/resourceGetQuery.ts"
import type { ResourceFilesModel } from "#src/resource/model/ResourceFilesModel.ts"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { notEmptyFilter } from "#utils/arr/notEmptyFilter.js"
import { v } from "convex/values"

export const resourceFilesGetFields = {
  resourceId: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type ResourceFilesGetValidatorType = typeof resourceFilesGetValidator.type
export const resourceFilesGetValidator = v.object(resourceFilesGetFields)

export const resourceFilesGetQuery = query({
  args: createTokenValidator(resourceFilesGetFields),
  handler: async (ctx, args) => authQueryResult(ctx, args, resourceFilesGetFn),
})

export const resourceFilesGetInternalQuery = internalQuery({
  args: resourceFilesGetValidator,
  handler: resourceFilesGetFn,
})

export async function resourceFilesGetFn(
  ctx: QueryCtx,
  args: ResourceFilesGetValidatorType,
): PromiseResult<ResourceFilesModel | null> {
  const op = "resourceFilesGetFn"

  const resourceFiles = await resourceFilesGetModelFn(ctx, args.resourceId)
  if (!resourceFiles) {
    return createResultError(op, "Resource not found", args.resourceId)
  }
  if (args.updatedAt && args.updatedAt === resourceFiles.resource.updatedAt) {
    return createResult(null)
  }
  return createResult(resourceFiles)
}

export async function resourceFilesGetModelFn(ctx: QueryCtx, resourceId: string): Promise<ResourceFilesModel | null> {
  const resourceDoc = await resourceGetDocFn(ctx, resourceId)
  if (!resourceDoc) return null

  const resource = resourceDocToModel(resourceDoc)

  const list = await ctx.db
    .query("resourceFiles")
    .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
    .collect()

  const all = await Promise.all(list.map((mr) => fileGetByIdFn(ctx, mr.fileId)))
  const filtered = all.filter(notEmptyFilter)
  const files = filtered.map(fileDocToModel)

  return { resource, files }
}
