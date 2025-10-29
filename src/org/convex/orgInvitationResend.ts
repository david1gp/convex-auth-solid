import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { IdOrgInvitation } from "@/org/convex/IdOrg"
import type { MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { sendEmailOrgInvitation } from "../../auth/convex/email/sendEmailOrgInvitation"

export type OrgInvitationResendValidatorType = typeof orgInvitationResendValidator.type

export const orgInvitationResendFields = {
  token: v.string(),
  // id
  orgHandle: v.string(),
  invitedEmail: v.string(),
}

export const orgInvitationResendValidator = v.object(orgInvitationResendFields)

export async function orgInvitationResend(
  ctx: MutationCtx,
  args: OrgInvitationResendValidatorType,
): PromiseResult<IdOrgInvitation> {
  const op = "orgInvitationResend"

  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const invitedBy = verifiedResult.data.sub as IdUser

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const existingInvitation = await ctx.db
    .query("orgInvitations")
    .withIndex("invitedEmail", (q) => q.eq("invitedEmail", args.invitedEmail))
    .first()
  if (!existingInvitation) {
    return createResultError(op, "Invitation not found", args.invitedEmail)
  }
  if (existingInvitation.acceptedAt) {
    return createResultError(op, "Invitation already accepted", args.invitedEmail)
  }

  const now = nowIso()
  await ctx.db.patch(existingInvitation._id, {
    emailSendAt: now,
    emailSendAmount: existingInvitation.emailSendAmount + 1,
    updatedAt: now,
  })

  // Send email
  const emailResult = await sendEmailOrgInvitation(args.invitedEmail, existingInvitation.invitationCode, "")
  if (!emailResult.success) {
    console.error("Failed to resend invitation email", emailResult)
    // Note: Continue even if email fails
  }

  return createResult(existingInvitation._id)
}

export async function orgInvitationResendFn(
  ctx: MutationCtx,
  args: OrgInvitationResendValidatorType,
): PromiseResult<IdOrgInvitation> {
  return await orgInvitationResend(ctx, args)
}
