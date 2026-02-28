import { fileGetByIdFn } from "@/file/convex/fileGetByIdFn"
import { resourceFileRemoveMutationFn } from "@/resource/convex/resourceFileRemoveMutation"
import { authMutation } from "@/utils/convex_backend/authMutation"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type FileDeleteValidatorType = typeof fileDeleteValidator.type

export const fileDeleteFields = {
  fileId: v.string(),
} as const

export const fileDeleteValidator = v.object(fileDeleteFields)

export const fileDeleteMutation = mutation({
  args: createTokenValidator(fileDeleteFields),
  handler: async (ctx, args) => authMutation(ctx, args, fileDeleteFn),
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
