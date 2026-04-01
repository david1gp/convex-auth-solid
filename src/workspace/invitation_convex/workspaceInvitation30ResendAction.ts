import { internal } from "#convex/_generated/api.js"
import { action, type ActionCtx } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import { verifyTokenResult } from "#src/auth/server/jwt_token/verifyTokenResult.ts"
import { workspaceInvitation31SendFn } from "#src/workspace/invitation_convex/workspaceInvitation31SendInternalAction.ts"
import { allowEmailResendingInSeconds } from "#src/workspace/invitation_model/allowEmailResendingInSeconds.ts"
import { workspaceInvitationStatus } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { stt1 } from "#src/utils/i18n/stt.ts"
import { v } from "convex/values"

export type WorkspaceInvitationResendValidatorType = typeof workspaceInvitation30ResendValidator.type

export const workspaceInvitationResendFields = {
  token: v.string(),
  invitationCode: v.string(),
} as const

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
  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
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

  return workspaceInvitation31SendFn(ctx, { token: args.token, invitationCode: args.invitationCode })
}
