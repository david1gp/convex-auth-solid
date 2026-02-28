import type { DocResource } from "@/resource/convex/IdResource"
import { resourceDataFields } from "@/resource/convex/resourceTables"
import { resourceDataSchemaFields } from "@/resource/model/resourceSchema"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export const resourceEditFields = {
  ...resourceDataFields,
  // Files
  fileIds: v.optional(v.array(v.string())),
}
export const resourceEditValidator = v.object(resourceEditFields)
export type ResourceEditValidatorType = typeof resourceEditValidator.type

export const resourceEditMutation = mutation({
  args: createTokenValidator(resourceEditFields),
  handler: async (ctx, args) => authMutationR(ctx, args, resourceEditFn),
})

export const resourceEditInternalMutation = internalMutation({
  args: resourceEditValidator,
  handler: resourceEditFn,
})

export async function resourceEditFn(ctx: MutationCtx, args: ResourceEditValidatorType): PromiseResult<null> {
  const op = "resourceEditFn"

  const schema = a.object({
    ...resourceDataSchemaFields,
    fileIds: a.optional(a.array(a.string())),
  })

  const parse = a.safeParse(schema, args)
  if (!parse.success) {
    return createResultError(op, a.summarize(parse.issues))
  }
  const { resourceId, fileIds, ...rest } = parse.output

  const resource = await ctx.db
    .query("resources")
    .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
    .unique()
  if (!resource) {
    return createResultError(op, "Resource not found", resourceId)
  }

  // Update file assignments if provided
  if (fileIds !== undefined) {
    const updateResult = await updateAssignedFileIds(ctx, resourceId, fileIds)
    if (!updateResult.success) {
      return updateResult
    }
  }

  // const { resourceId, ...rest } = args
  const patch: Partial<DocResource> = rest
  patch.updatedAt = nowIso()

  await ctx.db.patch("resources", resource._id, patch)
  return createResult(null)
}

export async function updateAssignedFileIds(
  ctx: MutationCtx,
  resourceId: string,
  fileIds: string[],
): PromiseResult<null> {
  const op = "updateAssignedFileIds"

  // Get current file assignments for this resource
  const existing = await ctx.db
    .query("resourceFiles")
    .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
    .collect()

  const currentFileIds = new Set(existing.map((e) => e.fileId))
  const newFileIds = new Set(fileIds)

  // Find files to add (in new but not in current)
  const toAdd = fileIds.filter((fileId) => !currentFileIds.has(fileId))

  // Find files to remove (in current but not in new)
  const toRemove = existing.filter((e) => !newFileIds.has(e.fileId))

  // Add new file assignments
  if (toAdd.length > 0) {
    const filesToAdd = await Promise.all(
      toAdd.map((fileId) =>
        ctx.db
          .query("files")
          .withIndex("fileId", (q) => q.eq("fileId", fileId))
          .first(),
      ),
    )
    for (const file of filesToAdd) {
      if (!file) continue
      await ctx.db.insert("resourceFiles", {
        resourceId: resourceId,
        fileId: file.fileId,
        createdAt: nowIso(),
      })
    }
  }

  // Remove old file assignments
  for (const assignment of toRemove) {
    await ctx.db.delete("resourceFiles", assignment._id)
  }

  return createResult(null)
}
