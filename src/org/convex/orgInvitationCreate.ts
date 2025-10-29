import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { IdOrgInvitation } from "@/org/convex/IdOrg"
import { orgRoleValidator } from "@/org/model/orgRoleValidator"
import type { MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { generateId12 } from "~utils/ran/generateId12"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { sendEmailOrgInvitation } from "../../auth/convex/email/sendEmailOrgInvitation"

export type OrgInvitationCreateValidatorType = typeof orgInvitationCreateValidator.type

export const orgInvitationCreateFields = {
  token: v.string(),
  // id
  orgHandle: v.string(),
  invitedEmail: v.string(),
  // data
  role: orgRoleValidator,
}

export const orgInvitationCreateValidator = v.object(orgInvitationCreateFields)

export async function orgInvitationCreate(
  ctx: MutationCtx,
  args: OrgInvitationCreateValidatorType,
): PromiseResult<IdOrgInvitation> {
  const op = "orgInvitationCreate"

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

  // Check if invitation already exists and not accepted
  const existingInvitation = await ctx.db
    .query("orgInvitations")
    .withIndex("invitedEmail", (q) => q.eq("invitedEmail", args.invitedEmail))
    .first()
  if (existingInvitation && !existingInvitation.acceptedAt) {
    return createResultError(op, "Invitation already sent", args.invitedEmail)
  }

  const now = nowIso()
  const invitationCode = generateId12()
  const orgInvitationId = await ctx.db.insert("orgInvitations", {
    orgId: org._id,
    invitedEmail: args.invitedEmail,
    invitationCode,
    role: args.role,
    invitedBy,
    emailSendAt: now,
    emailSendAmount: 1,
    acceptedAt: undefined,
    createdAt: now,
    updatedAt: now,
  })

  // Send email
  const emailResult = await sendEmailOrgInvitation(args.invitedEmail, invitationCode, "")
  if (!emailResult.success) {
    console.error("Failed to send invitation email", emailResult)
    // Note: Continue even if email fails, as the invitation is created
  }

  return createResult(orgInvitationId)
}

export async function orgInvitationCreateFn(
  ctx: MutationCtx,
  args: OrgInvitationCreateValidatorType,
): PromiseResult<IdOrgInvitation> {
  return await orgInvitationCreate(ctx, args)
}
