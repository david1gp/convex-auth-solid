import { internal } from "#convex/_generated/api.js"
import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { languageValidator } from "#src/app/i18n/language.js"
import { findUserByEmailFn } from "#src/auth/convex/crud/findUserByEmailQuery.js"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.js"
import { orgInvitation21CreateMutationFn } from "#src/org/invitation_convex/orgInvitation21CreateInternalMutation.js"
import { orgMemberGetByUserIdFn } from "#src/org/member_convex/orgMemberGetByUserIdFn.js"
import { orgRoleValidator } from "#src/org/org_model_field/orgRoleValidator.js"
import { generateId12 } from "#utils/ran/generateId12.js"
import { v } from "convex/values"

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

  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const invitedBy = verifiedResult.data

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
