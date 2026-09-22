import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import { createError, createResult, type PromiseResult } from "#result"
import type { DocWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import { workspaceInvitationDataSchemaFields } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { nowIso } from "#utils/date/nowIso.js"

export type WorkspaceInvitationUpdateValidatorType = typeof workspaceInvitationUpdateValidator.type

export const workspaceInvitationUpdateFields = {
  _id: v.id("workspaceInvitations"),
  ...valibotToConvex({
    workspaceHandle: a.optional(workspaceInvitationDataSchemaFields.workspaceHandle),
    invitedEmail: a.optional(workspaceInvitationDataSchemaFields.invitedEmail),
    invitationCode: a.optional(workspaceInvitationDataSchemaFields.invitationCode),
    role: a.optional(workspaceInvitationDataSchemaFields.role),
    invitedBy: a.optional(workspaceInvitationDataSchemaFields.invitedBy),
    // Keep these input fields broad as in the existing Convex validator.
    status: a.optional(a.string()),
    expiresAt: a.optional(a.string()),
  }),
} as const

export const workspaceInvitationUpdateValidator = v.object(workspaceInvitationUpdateFields)

export const workspaceInvitation33UpdateInternalMutation = internalMutation({
  args: workspaceInvitationUpdateValidator,
  handler: workspaceInvitation33UpdateFn,
})

export async function workspaceInvitation33UpdateFn(
  ctx: MutationCtx,
  args: WorkspaceInvitationUpdateValidatorType,
): PromiseResult<null> {
  const op = "workspaceInvitationUpdateFn"

  const schema = a.partial(a.object(workspaceInvitationDataSchemaFields))
  const parse = a.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, a.summarize(parse.issues))
  }

  const patch: Partial<DocWorkspaceInvitation> = { ...parse.output }

  if (!patch.updatedAt) {
    patch.updatedAt = nowIso()
  }

  await ctx.db.patch("workspaceInvitations", args._id, patch)
  return createResult(null)
}
