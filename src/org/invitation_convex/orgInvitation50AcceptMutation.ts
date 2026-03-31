import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { DocUser, IdUser } from "#src/auth/convex/IdUser.ts"
import { saveTokenIntoSessionReturnExpiresAtFn } from "#src/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation.ts"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"
import { loginMethod } from "#src/auth/model_field/loginMethod.ts"
import { createTokenResult } from "#src/auth/server/jwt_token/createTokenResult.ts"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.ts"
import { orgGetQueryInternalFn } from "#src/org/org_convex/orgGetQuery.ts"
import { stt } from "#src/utils/i18n/stt.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

export type OrgInvitationAcceptValidatorType = typeof orgInvitationAcceptValidator.type

export const orgInvitationAcceptFields = {
  token: v.string(),
  orgHandle: v.optional(v.string()),
  invitationCode: v.string(),
}

export const orgInvitationAcceptValidator = v.object(orgInvitationAcceptFields)

export const orgInvitation50AcceptMutation = mutation({
  args: orgInvitationAcceptValidator,
  handler: orgInvitation50AcceptFn,
})

export async function orgInvitation50AcceptFn(
  ctx: MutationCtx,
  args: OrgInvitationAcceptValidatorType,
): PromiseResult<UserSession> {
  const op = "orgInvitationAccept"

  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const userId = verifiedResult.data

  // Find invitation
  const invitation = await ctx.db
    .query("orgInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()

  if (!invitation) {
    return createResultError(op, "Invalid invitation code", args.invitationCode)
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
  const user = await ctx.db.get("users", userId)
  if (!user) {
    return createResultError(op, "User not found", userId)
  }

  // Check for email mismatch (case-insensitive, trim whitespace)
  if (user.email && user.email.toLowerCase().trim() !== invitation.invitedEmail.toLowerCase().trim()) {
    const errorMessage = stt(
      "Email mismatch, please use the same email as in the invitation (" + invitation.invitedEmail + ").",
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
  await ctx.db.patch("users", userId, data)

  // Create session
  const tokenResult = await createTokenResult(userId, org.orgHandle, invitation.role)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)

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

  // Delete org invitation
  await ctx.db.delete("orgInvitations", invitation._id)

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
