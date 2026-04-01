import { api, internal } from "#convex/_generated/api.js"
import { internalAction, type ActionCtx } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.ts"
import {
  workspaceInvitation32SendEmailActionFn,
  type WorkspaceInvitationSendEmailValidatorType,
} from "#src/workspace/invitation_convex/workspaceInvitation32SendEmailActionFn.ts"
import { workspaceInvitationStatus } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { allowEmailResendingInSeconds } from "#src/workspace/invitation_model/allowEmailResendingInSeconds.ts"
import { stt1 } from "#src/utils/i18n/stt.ts"
import { v } from "convex/values"

export type WorkspaceInvitationSendValidatorType = typeof workspaceInvitation31SendValidator.type

export const workspaceInvitationSendFields = {
  token: v.string(),
  invitationCode: v.string(),
} as const

export const workspaceInvitation31SendValidator = v.object(workspaceInvitationSendFields)

export const workspaceInvitation31SendInternalAction = internalAction({
  args: workspaceInvitation31SendValidator,
  handler: workspaceInvitation31SendFn,
})

export async function workspaceInvitation31SendFn(
  ctx: ActionCtx,
  args: WorkspaceInvitationSendValidatorType,
): PromiseResult<null> {
  const op = "workspaceInvitationResend"
  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }

  const invitedBy = await ctx.runQuery(internal.auth.userGetInternalQuery, {
    userId: verifiedResult.data,
  })
  if (!invitedBy) {
    return createResultError(op, "!user")
  }

  const invitationResult = await ctx.runQuery(api.workspace.workspaceInvitationGetQuery, {
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

  const allowSendingInSeconds = allowEmailResendingInSeconds(
    invitation.expiresAt,
    0,
  )
  if (allowSendingInSeconds > 0) {
    const errorMessage = stt1("Allow resending in [X] seconds", allowSendingInSeconds.toString())
    return createResultError(op, errorMessage)
  }

  const workspaceResult = await ctx.runQuery(internal.workspace.workspaceGetInternal, {
    workspaceHandle: invitation.workspaceHandle,
  })
  if (!workspaceResult.success) {
    return workspaceResult
  }
  const workspace = workspaceResult.data
  if (!workspace) {
    return createResultError(op, "!workspace")
  }

  const sendProps: WorkspaceInvitationSendEmailValidatorType = {
    invitationCode: args.invitationCode,
    invitedByEmail: invitedBy.email ?? "",
    invitedByName: invitedBy.name,
    invitedEmail: invitation.invitedEmail,
    workspaceName: workspace.name ?? "",
    workspaceHandle: workspace.workspaceHandle,
    role: invitation.role,
  }
  return workspaceInvitation32SendEmailActionFn(ctx, sendProps)
}
