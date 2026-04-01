import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import type { IdWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import { workspaceRoleValidator } from "#src/workspace/workspace_model_field/workspaceRoleValidator.ts"
import { workspaceInvitationStatus } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

export const workspaceInvitationCreateDataFields = {
  workspaceHandle: v.string(),
  invitationCode: v.string(),
  invitedEmail: v.string(),
  role: workspaceRoleValidator,
  invitedBy: v.string(),
  status: v.literal(workspaceInvitationStatus.pending),
  expiresAt: v.string(),
} as const

export const workspaceInvitationCreateMutationValidator = v.object(workspaceInvitationCreateDataFields)

export type WorkspaceInvitationCreateMutationValidatorType = typeof workspaceInvitationCreateMutationValidator.type

export const workspaceInvitation21CreateInternalMutation = internalMutation({
  args: workspaceInvitationCreateMutationValidator,
  handler: workspaceInvitation21CreateMutationFn,
})

export async function workspaceInvitation21CreateMutationFn(
  ctx: MutationCtx,
  args: WorkspaceInvitationCreateMutationValidatorType,
): PromiseResult<IdWorkspaceInvitation> {
  const now = nowIso()
  const newId = await ctx.db.insert("workspaceInvitations", {
    ...args,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(newId)
}
