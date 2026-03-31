import { api } from "#convex/_generated/api.js"
import { action, type ActionCtx } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import { languageValidator } from "#src/app/i18n/language.ts"
import { verifyTokenResult } from "#src/auth/server/jwt_token/verifyTokenResult.ts"
import { orgInvitation31SendFn } from "#src/org/invitation_convex/orgInvitation31SendInternalAction.ts"
import { allowEmailResendingInSeconds } from "#src/org/invitation_model/allowEmailResendingInSeconds.ts"
import { stt1 } from "#src/utils/i18n/stt.ts"
import { v } from "convex/values"

export type OrgInvitationResendValidatorType = typeof orgInvitation30ResendValidator.type

export const orgInvitationResendFields = {
  token: v.string(),
  invitationCode: v.string(),
  l: v.optional(languageValidator),
} as const

export const orgInvitation30ResendValidator = v.object(orgInvitationResendFields)

export const orgInvitation30ResendAction = action({
  args: orgInvitation30ResendValidator,
  handler: orgInvitation30ResendFn,
})

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
