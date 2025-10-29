import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtFn"
import { hashPassword2 } from "@/auth/convex/pw/hashPassword"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model/loginMethod"
import { userRole } from "@/auth/model/userRole"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import type { MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { dbUsersToUserProfile } from "../../auth/convex/crud/dbUsersToUserProfile"

export type OrgInvitationAcceptValidatorType = typeof orgInvitationAcceptValidator.type

export const orgInvitationAcceptFields = {
  invitationCode: v.string(),
  name: v.string(),
  username: v.string(),
  password: v.string(),
}

export const orgInvitationAcceptValidator = v.object(orgInvitationAcceptFields)

export async function orgInvitationAccept(
  ctx: MutationCtx,
  args: OrgInvitationAcceptValidatorType,
): PromiseResult<UserSession> {
  const op = "orgInvitationAccept"

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
  const org = await ctx.db.get(invitation.orgId)
  if (!org) {
    return createResultError(op, "Organization not found")
  }

  // Find or create user
  const existingUser = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", invitation.invitedEmail))
    .unique()

  const now = nowIso()
  let userDoc
  if (existingUser) {
    userDoc = existingUser
  } else {
    // Hash password
    const hashedPasswordResult = await hashPassword2(args.password)
    if (!hashedPasswordResult.success) {
      console.warn(hashedPasswordResult)
      return createResultError(op, "Failed to hash password")
    }
    const hashedPassword = hashedPasswordResult.data

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      username: args.username,
      email: invitation.invitedEmail,
      emailVerifiedAt: now,
      hashedPassword,
      role: userRole.user,
      createdAt: now,
      deletedAt: undefined,
    })
    userDoc = await ctx.db.get(userId)
    if (!userDoc) {
      return createResultError(op, "Failed to create user")
    }
  }

  // Update user if necessary
  if (userDoc.emailVerifiedAt !== now) {
    await ctx.db.patch(userDoc._id, {
      emailVerifiedAt: nowIso(),
    })
  }
  if (!userDoc.username) {
    await ctx.db.patch(userDoc._id, {
      username: args.username,
    })
  }

  // Create session
  const tokenResult = await createTokenResult(userDoc._id, org.orgHandle, invitation.role)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userDoc._id, token)

  // Mark invitation as accepted
  await ctx.db.patch(invitation._id, {
    acceptedAt: nowIso(),
    updatedAt: nowIso(),
  })

  // Create org member
  const orgMemberId = await ctx.db.insert("orgMembers", {
    orgId: invitation.orgId,
    userId: userDoc._id,
    role: invitation.role,
    invitedBy: invitation.invitedBy,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  })

  // Create user profile
  const userProfile = dbUsersToUserProfile(userDoc, org.orgHandle, invitation.role)

  // Create and return user session
  const userSession: UserSession = {
    token,
    user: userProfile,
    signedInMethod: loginMethod.email,
    signedInAt: nowIso(),
    expiresAt,
  }

  return createResult(userSession)
}

export async function orgInvitationAcceptFn(
  ctx: MutationCtx,
  args: OrgInvitationAcceptValidatorType,
): PromiseResult<UserSession> {
  return await orgInvitationAccept(ctx, args)
}
