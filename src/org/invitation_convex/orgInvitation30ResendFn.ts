import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import { orgInvitation31SendFn } from "@/org/invitation_convex/orgInvitation31SendFn"
import { allowEmailResendingInSeconds } from "@/org/invitation_model/allowEmailResendingInSeconds"
import { stt1 } from "@/utils/i18n/stt"
import { api } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgInvitationResendValidatorType = typeof orgInvitationResendValidator.type

export const orgInvitationResendFields = {
  token: v.string(),
  invitationCode: v.string(),
} as const

export const orgInvitationResendValidator = v.object(orgInvitationResendFields)

export async function orgInvitation30ResendFn(
  ctx: ActionCtx,
  args: OrgInvitationResendValidatorType,
): PromiseResult<null> {
  const op = "orgInvitationResend"
  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
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

  return orgInvitation31SendFn(ctx, args)
}
