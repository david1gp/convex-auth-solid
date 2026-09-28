import { v } from "convex/values"
import * as a from "valibot"
import { internal } from "#convex/_generated/api.js"
import { type ActionCtx, action } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { authActionCredentialResolve } from "#src/utils/convex_backend/authActionCredentialResolve.ts"
import { stt1 } from "#src/utils/i18n/stt.ts"
import { workspaceInvitation31SendFn } from "#src/workspace/invitation_convex/workspaceInvitation31SendInternalAction.ts"
import { allowEmailResendingInSeconds } from "#src/workspace/invitation_model/allowEmailResendingInSeconds.ts"
import { workspaceInvitationStatus } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"

export type WorkspaceInvitationResendValidatorType = typeof workspaceInvitation30ResendValidator.type

export const workspaceInvitationResendFields = valibotToConvex({
  token: a.string(),
  invitationCode: a.string(),
})

export const workspaceInvitation30ResendValidator = v.object(workspaceInvitationResendFields)

export const workspaceInvitation30ResendAction = action({
  args: workspaceInvitation30ResendValidator,
  handler: workspaceInvitation30ResendFn,
})

export async function workspaceInvitation30ResendFn(
  ctx: ActionCtx,
  args: WorkspaceInvitationResendValidatorType,
): PromiseResult<null> {
  const op = "workspaceInvitationResend"
  const credentialResult = await authActionCredentialResolve(ctx, args.token)
  if (!credentialResult.success) {
    console.info(credentialResult)
    return credentialResult
  }
  const invitationResult = await ctx.runQuery(internal.workspace.workspaceInvitationGetInternalQuery, {
    invitationCode: args.invitationCode,
  })
  if (!invitationResult.success) {
    return invitationResult
  }
  const invitation = invitationResult.data
  if (!invitation) {
    return createResultError(op, "!invitation")
  }

  if (invitation.status !== workspaceInvitationStatus.pending) {
    return createResultError(op, "Invitation is not pending")
  }

  const allowSendingInSeconds = allowEmailResendingInSeconds(invitation.expiresAt, 0)
  if (allowSendingInSeconds > 0) {
    const errorMessage = stt1("Allow resending in [X] seconds", allowSendingInSeconds.toString())
    return createResultError(op, errorMessage)
  }

  return workspaceInvitation31SendFn(ctx, {
    token: args.token,
    invitationCode: args.invitationCode,
  })
}
