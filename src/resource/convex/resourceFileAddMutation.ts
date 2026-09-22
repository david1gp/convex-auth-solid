import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx, mutation } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { resourceGetDocFn } from "#src/resource/convex/resourceGetQuery.ts"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { nowIso } from "#utils/date/nowIso.js"

export type MeetingOrgAddMutationValidatorType = typeof resourceFileAddValidator.type

const resourceFileAddSchemaFields = {
  resourceId: a.string(),
  fileId: a.string(),
} as const
export const resourceFileAddFields = valibotToConvex(resourceFileAddSchemaFields)

export const resourceFileAddValidator = v.object(resourceFileAddFields)

export const resourceFileAddMutation = mutation({
  args: createTokenValidator(resourceFileAddFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, resourceFileAddMutationFn),
})

export const resourceFileAddInternalMutation = internalMutation({
  args: resourceFileAddValidator,
  handler: resourceFileAddMutationFn,
})

export async function resourceFileAddMutationFn(
  ctx: MutationCtx,
  args: MeetingOrgAddMutationValidatorType,
): PromiseResult<null> {
  const op = "resourceFileAddMutationFn"
  const resource = await resourceGetDocFn(ctx, args.resourceId)
  if (!resource) {
    return createResultError(op, "Resource not found", args.resourceId)
  }
  await ctx.db.insert("resourceFiles", {
    resourceId: args.resourceId,
    fileId: args.fileId,
    createdAt: nowIso(),
  })
  return createResult(null)
}
