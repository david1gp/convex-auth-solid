import { v } from "convex/values"
import * as a from "valibot"
import { api, internal } from "#convex/_generated/api.js"
import { type ActionCtx, internalAction } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import { languageSchema } from "#src/app/i18n/language.ts"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.ts"
import {
  type OrgInvitationSendEmailValidatorType,
  orgInvitation32SendEmailActionFn,
} from "#src/org/invitation_convex/orgInvitation32SendEmailActionFn.ts"
import { allowEmailResendingInSeconds } from "#src/org/invitation_model/allowEmailResendingInSeconds.ts"
import { stt1 } from "#src/utils/i18n/stt.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"

export type OrgInvitationSendValidatorType = typeof orgInvitation31SendValidator.type

export const orgInvitationSendFields = valibotToConvex({
  token: a.string(),
  invitationCode: a.string(),
  l: a.optional(languageSchema),
})

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

  const invitationResult = await ctx.runQuery(api.org.orgInvitationGetQuery, {
    invitationCode: args.invitationCode,
  })
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

  const orgResult = await ctx.runQuery(api.org.orgGetQuery, {
    token: args.token,
    orgHandle: invitation.orgHandle,
  })
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
