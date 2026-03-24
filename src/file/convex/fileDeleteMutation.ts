import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { fileGetByIdFn } from "#src/file/convex/fileGetByIdFn.js"
import { resourceFileRemoveMutationFn } from "#src/resource/convex/resourceFileRemoveMutation.js"
import { authMutationWrapResult } from "#src/utils/convex_backend/authMutationWrapResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { v } from "convex/values"

export type FileDeleteValidatorType = typeof fileDeleteValidator.type

export const fileDeleteFields = {
  fileId: v.string(),
} as const

export const fileDeleteValidator = v.object(fileDeleteFields)

export const fileDeleteMutation = mutation({
  args: createTokenValidator(fileDeleteFields),
  handler: async (ctx, args) => authMutationWrapResult(ctx, args, fileDeleteFn),
})

export const fileDeleteInternalMutation = internalMutation({
  args: fileDeleteValidator,
  handler: fileDeleteFn,
})

export async function fileDeleteFn(ctx: MutationCtx, args: FileDeleteValidatorType): Promise<null> {
  const file = await fileGetByIdFn(ctx, args.fileId)
  if (!file) return null // idempotent
  // ctx.db.patch(file._id, { deletedAt: nowIso() })
  const resourceId = file.resourceId
  if (resourceId) {
    await resourceFileRemoveMutationFn(ctx, { resourceId: resourceId, fileId: args.fileId })
  }
  await ctx.db.delete("files", file._id)
  return null
}
