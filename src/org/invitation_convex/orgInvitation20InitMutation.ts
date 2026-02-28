import { languageValidator } from "@/app/i18n/language"
import { findUserByEmailFn } from "@/auth/convex/crud/findUserByEmailQuery"
import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import { orgInvitation21CreateMutationFn } from "@/org/invitation_convex/orgInvitation21CreateInternalMutation"
import { orgMemberGetByUserIdFn } from "@/org/member_convex/orgMemberGetByUserIdFn"
import { orgRoleValidator } from "@/org/org_model_field/orgRoleValidator"
import { internal } from "@convex/_generated/api"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { generateId12 } from "~utils/ran/generateId12"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgInvitationCreateValidatorType = typeof orgInvitationCreateActionValidator.type

export const orgInvitationInitMutationFields = {
  token: v.string(),
  // id
  orgHandle: v.string(),
  invitedName: v.string(),
  invitedEmail: v.string(),
  l: languageValidator,
  // data
  role: orgRoleValidator,
}

export const orgInvitationCreateActionValidator = v.object(orgInvitationInitMutationFields)

export const orgInvitation20InitMutation = mutation({
  args: orgInvitationCreateActionValidator,
  handler: orgInvitation20InitMutationFn,
})

export async function orgInvitation20InitMutationFn(
  ctx: MutationCtx,
  args: OrgInvitationCreateValidatorType,
): PromiseResult<string> {
  const op = "orgInvitation20InitMutationFn"

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

  // Check if already in org
  const invitedUser = await findUserByEmailFn(ctx, args.invitedEmail)
  if (invitedUser) {
    const existingMember = await orgMemberGetByUserIdFn(ctx, invitedUser._id)
    if (existingMember && existingMember.orgHandle === args.orgHandle) {
      return createResultError(op, "User is already a member of this organization", args.invitedEmail)
    }
  }

  const invitationCode = generateId12()

  // init/create invitation
  await orgInvitation21CreateMutationFn(ctx, {
    invitationCode: invitationCode,
    invitedBy: invitedBy,
    invitedName: args.invitedName,
    invitedEmail: args.invitedEmail,
    l: args.l,
    orgHandle: args.orgHandle,
    role: args.role,
  })

  // shedule email sending
  await ctx.scheduler.runAfter(0, internal.org.orgInvitation31SendInternalAction, { token: args.token, invitationCode })

  return createResult(invitationCode)
}
