import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import type { IdWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import {
  workspaceInvitationDataSchemaFields,
  workspaceInvitationStatus,
} from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { nowIso } from "#utils/date/nowIso.js"

export const workspaceInvitationCreateDataFields = valibotToConvex({
  workspaceHandle: workspaceInvitationDataSchemaFields.workspaceHandle,
  invitationCode: a.string(),
  invitedEmail: workspaceInvitationDataSchemaFields.invitedEmail,
  role: workspaceInvitationDataSchemaFields.role,
  invitedBy: a.string(),
  status: a.literal(workspaceInvitationStatus.pending),
  expiresAt: workspaceInvitationDataSchemaFields.expiresAt,
})

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
