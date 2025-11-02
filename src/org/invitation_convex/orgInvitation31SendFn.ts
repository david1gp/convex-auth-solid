import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import {
  orgInvitation32SendEmailActionFn,
  type OrgInvitationSendEmailValidatorType,
} from "@/org/invitation_convex/orgInvitation32SendEmailActionFn"
import { allowEmailResendingInSeconds } from "@/org/invitation_model/allowEmailResendingInSeconds"
import { stt1 } from "@/utils/i18n/stt"
import { api, internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgInvitationSendValidatorType = typeof orgInvitationSendValidator.type

export const orgInvitationSendFields = {
  token: v.string(),
  invitationCode: v.string(),
} as const

export const orgInvitationSendValidator = v.object(orgInvitationSendFields)

export async function orgInvitation31SendFn(ctx: ActionCtx, args: OrgInvitationSendValidatorType): PromiseResult<null> {
  const op = "orgInvitationResend"
  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }

  const invitedBy = await ctx.runQuery(internal.auth.userGetQuery, { userId: verifiedResult.data.sub as IdUser })
  if (!invitedBy) {
    return createResultError(op, "!user")
  }

  const invitationResult = await ctx.runQuery(api.org.orgInvitationGetQuery, { invitationCode: args.invitationCode })
  if (!invitationResult.success) {
    return invitationResult
  }
  const invitation = invitationResult.data
  if (!invitation) {
    return createResultError(op, "!invitation")
  }

  if (invitation.acceptedAt) {
    return createResultError(op, "Invitation already accepted", args.invitationCode)
  }

  const allowSendingInSeconds = allowEmailResendingInSeconds(
    invitation.emailSendAt ?? invitation.createdAt,
    invitation.emailSendAmount,
  )
  if (allowSendingInSeconds > 0) {
    const errorMessage = stt1("Allow resending in [X] seconds", allowSendingInSeconds.toString())
    return createResultError(op, errorMessage)
  }

  const orgResult = await ctx.runQuery(api.org.orgGetQuery, { token: args.token, orgHandle: invitation.orgHandle })
  if (!orgResult.success) {
    return orgResult
  }
  const org = orgResult.data
  if (!org) {
    return createResultError(op, "!org")
  }

  const sendProps: OrgInvitationSendEmailValidatorType = {
    invitationCode: args.invitationCode,
    invitedByEmail: invitedBy.email ?? "",
    invitedByName: invitedBy.name,
    invitedEmail: invitation.invitedEmail,
    invitedName: invitation.invitedName,
    orgName: org.name,
    orgHandle: org.orgHandle,
    role: invitation.role,
  }
  return orgInvitation32SendEmailActionFn(ctx, sendProps)
}
