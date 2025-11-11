import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model/loginMethod"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import { orgGetQueryInternalFn } from "@/org/org_convex/orgGetQuery"
import { stt } from "@/utils/i18n/stt"
import { internal } from "@convex/_generated/api"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { docUserToUserProfile } from "../../auth/convex/user/docUserToUserProfile"

export type OrgInvitationAcceptValidatorType = typeof orgInvitationAcceptValidator.type

export const orgInvitationAcceptFields = {
  token: v.string(),
  orgHandle: v.optional(v.string()),
  invitationCode: v.string(),
}

export const orgInvitationAcceptValidator = v.object(orgInvitationAcceptFields)

export const orgInvitationAcceptMutation = mutation({
  args: orgInvitationAcceptValidator,
  handler: orgInvitation50AcceptFn,
})

export async function orgInvitation50AcceptFn(
  ctx: MutationCtx,
  args: OrgInvitationAcceptValidatorType,
): PromiseResult<UserSession> {
  const op = "orgInvitationAccept"

  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const userId = verifiedResult.data.sub as IdUser

  // Find invitation
  const invitation = await ctx.db
    .query("orgInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()

  if (!invitation) {
    return createResultError(op, "Invalid invitation code", args.invitationCode)
  }

  if (invitation.acceptedAt) {
    return createResultError(op, "Invitation already accepted", args.invitationCode)
  }

  // Get org details for token
  const orgResult = await orgGetQueryInternalFn(ctx, { orgHandle: invitation.orgHandle })
  if (!orgResult.success) {
    return orgResult
  }
  const org = orgResult.data
  if (!org) {
    return createResultError(op, "Organization not found")
  }

  // Find or create user
  const user = await ctx.db.get(userId)
  if (!user) {
    return createResultError(op, "User not found", userId)
  }

  // Check for email mismatch
  if (user.email && user.email !== invitation.invitedEmail) {
    const errorMessage = stt(
      "Email mismatch, please use the same email as in the invitation. Sign up the with invited email or resend a new invitation to the desired email address",
    )
    return createResultError(op, errorMessage, userId)
  }

  const now = nowIso()

  // Update user if necessary
  const data: Partial<DocUser> = {
    emailVerifiedAt: now,
  }
  if (!user.email) {
    data.email = invitation.invitedEmail
  }
  await ctx.db.patch(userId, data)

  // Create session
  const tokenResult = await createTokenResult(userId, org.orgHandle, invitation.role)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)

  // Mark invitation as accepted
  await ctx.db.patch(invitation._id, {
    acceptedAt: now,
    updatedAt: now,
  })
  // Delete invitation
  // await ctx.db.delete(invitation._id)

  // Shedule cleanup
  const sheduleAt = 24 * 3600 * 1000 + 1
  ctx.scheduler.runAfter(sheduleAt, internal.org.orgInvitationCleanupInternalMutation, {})

  // Create org member
  await ctx.db.insert("orgMembers", {
    orgId: org._id,
    orgHandle: org.orgHandle,
    userId: userId,
    role: invitation.role,
    invitedBy: invitation.invitedBy as IdUser,
    createdAt: now,
    updatedAt: now,
  })

  // Create user profile
  const userProfile = docUserToUserProfile(user, org.orgHandle, invitation.role)

  // Create and return user session
  const userSession: UserSession = {
    token,
    profile: userProfile,
    hasPw: !!user.hashedPassword,
    signedInMethod: loginMethod.email,
    signedInAt: now,
    expiresAt,
  }

  return createResult(userSession)
}
