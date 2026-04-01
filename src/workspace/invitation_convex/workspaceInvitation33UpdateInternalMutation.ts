import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import { createError, createResult, type PromiseResult } from "#result"
import type { DocWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import { workspaceInvitationDataSchemaFields } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { workspaceRoleValidator } from "#src/workspace/workspace_model_field/workspaceRoleValidator.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
import * as a from "valibot"

export type WorkspaceInvitationUpdateValidatorType = typeof workspaceInvitationUpdateValidator.type

export const workspaceInvitationUpdateFields = {
  _id: v.id("workspaceInvitations"),
  workspaceHandle: v.optional(v.string()),
  invitedEmail: v.optional(v.string()),
  invitationCode: v.optional(v.string()),
  role: v.optional(workspaceRoleValidator),
  invitedBy: v.optional(v.string()),
  status: v.optional(v.string()),
  expiresAt: v.optional(v.string()),
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
