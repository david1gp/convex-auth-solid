import { createResultError, type PromiseResult } from "#result"
import { languageValidator } from "#src/app/i18n/language.js"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.js"
import {
    orgInvitation32SendEmailActionFn,
    type OrgInvitationSendEmailValidatorType,
} from "#src/org/invitation_convex/orgInvitation32SendEmailActionFn.js"
import { allowEmailResendingInSeconds } from "#src/org/invitation_model/allowEmailResendingInSeconds.js"
import { stt1 } from "#src/utils/i18n/stt.js"
import { api, internal } from "@convex/_generated/api.js"
import { internalAction, type ActionCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"

export type OrgInvitationSendValidatorType = typeof orgInvitation31SendValidator.type

export const orgInvitationSendFields = {
  token: v.string(),
  invitationCode: v.string(),
  l: v.optional(languageValidator),
} as const

export const orgInvitation31SendValidator = v.object(orgInvitationSendFields)

export const orgInvitation31SendInternalAction = internalAction({
  args: orgInvitation31SendValidator,
  handler: orgInvitation31SendFn,
})

export async function orgInvitation31SendFn(ctx: ActionCtx, args: OrgInvitationSendValidatorType): PromiseResult<null> {
  const op = "orgInvitationResend"
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

  const invitationResult = await ctx.runQuery(api.org.orgInvitationGetQuery, { invitationCode: args.invitationCode })
  if (!invitationResult.success) {
    return invitationResult
  }
  const invitation = invitationResult.data
  if (!invitation) {
    return createResultError(op, "!invitation")
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
    l: args.l ?? invitation.l,
    orgName: org.name ?? "",
    orgHandle: org.orgHandle,
    role: invitation.role,
  }
  return orgInvitation32SendEmailActionFn(ctx, sendProps)
}
