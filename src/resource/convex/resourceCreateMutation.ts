import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { IdResource } from "#src/resource/convex/IdResource.js"
import { resourceDataSchemaFields } from "#src/resource/model/resourceSchema.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
import * as a from "valibot"

export type ResourceCreateValidatorType = typeof resourceCreateValidator.type

export const resourceCreateFields = {
  ...valibotToConvex(resourceDataSchemaFields),
  // Files
  fileIds: v.optional(v.array(v.string())),
}

export const resourceCreateValidator = v.object(resourceCreateFields)

export const resourceCreateMutation = mutation({
  args: createTokenValidator(resourceCreateFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, resourceCreateFn),
})

export const resourceCreateInternalMutation = internalMutation({
  args: resourceCreateValidator,
  handler: resourceCreateFn,
})

export async function resourceCreateFn(ctx: MutationCtx, args: ResourceCreateValidatorType): PromiseResult<IdResource> {
  const op = "resourceCreateFn"

  const schema = a.object({
    ...resourceDataSchemaFields,
    // Files
    fileIds: a.optional(a.array(a.string())),
  })

  const parse = a.safeParse(schema, args)
  if (!parse.success) {
    return createResultError(op, a.summarize(parse.issues))
  }
  const { fileIds, ...rest } = parse.output

  const now = nowIso()
  const id = await ctx.db.insert("resources", {
    ...rest,
    createdAt: now,
    updatedAt: now,
  })

  // Associate files if provided
  if (fileIds && fileIds.length > 0) {
    await updateFileResouceIds(ctx, fileIds, id)
  }

  return createResult(id)
}

async function updateFileResouceIds(ctx: MutationCtx, fileIds: string[], resourceId: string) {
  return await Promise.all(fileIds.map((fileId) => updateFileResouceId(ctx, fileId, resourceId)))
}

async function updateFileResouceId(ctx: MutationCtx, fileId: string, resourceId: string) {
  const op = "updateFileResouceId"
  const file = await ctx.db
    .query("files")
    .withIndex("fileId", (q) => q.eq("fileId", fileId))
    .unique()
  if (file && !file.resourceId) {
    console.log(op, { fileId, resourceId })
    return ctx.db.patch("files", file._id, { resourceId })
  }
}
