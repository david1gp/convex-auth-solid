import { internal } from "#convex/_generated/api.js"
import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { DocUser, IdUser } from "#src/auth/convex/IdUser.ts"
import { saveTokenIntoSessionReturnExpiresAtFn } from "#src/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation.ts"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"
import { loginMethod } from "#src/auth/model_field/loginMethod.ts"
import { createTokenResult } from "#src/auth/server/jwt_token/createTokenResult.ts"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.ts"
import { workspaceInvitationStatus } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { stt } from "#src/utils/i18n/stt.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

export type WorkspaceInvitationAcceptValidatorType = typeof workspaceInvitationAcceptValidator.type

export const workspaceInvitationAcceptFields = {
  token: v.string(),
  workspaceHandle: v.optional(v.string()),
  invitationCode: v.string(),
}

export const workspaceInvitationAcceptValidator = v.object(workspaceInvitationAcceptFields)

export const workspaceInvitation50AcceptMutation = mutation({
  args: workspaceInvitationAcceptValidator,
  handler: workspaceInvitation50AcceptFn,
})

export async function workspaceInvitation50AcceptFn(
  ctx: MutationCtx,
  args: WorkspaceInvitationAcceptValidatorType,
): PromiseResult<UserSession> {
  const op = "workspaceInvitationAccept"

  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const userId = verifiedResult.data

  const invitation = await ctx.db
    .query("workspaceInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()

  if (!invitation) {
    return createResultError(op, "Invalid invitation code", args.invitationCode)
  }

  if (invitation.status !== workspaceInvitationStatus.pending) {
    return createResultError(op, "Invitation is not pending")
  }

  const workspaceResult = await ctx.runQuery(internal.workspace.workspaceGetInternal, {
    workspaceHandle: invitation.workspaceHandle,
  })
  if (!workspaceResult.success) {
    return workspaceResult
  }
  const workspace = workspaceResult.data
  if (!workspace) {
    return createResultError(op, "Workspace not found")
  }

  const user = await ctx.db.get("users", userId)
  if (!user) {
    return createResultError(op, "User not found", userId)
  }

  if (
    user.email &&
    user.email.toLowerCase().trim() !== invitation.invitedEmail.toLowerCase().trim()
  ) {
    const errorMessage = stt(
      "Email mismatch, please use the same email as in the invitation (" + invitation.invitedEmail + ").",
    )
    return createResultError(op, errorMessage, userId)
  }

  const now = nowIso()

  const data: Partial<DocUser> = {
    emailVerifiedAt: now,
  }
  if (!user.email) {
    data.email = invitation.invitedEmail
  }
  await ctx.db.patch("users", userId, data)

  const tokenResult = await createTokenResult(userId, workspace.workspaceHandle, invitation.role)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)

  await ctx.db.insert("workspaceMembers", {
    workspaceId: workspace._id,
    workspaceHandle: workspace.workspaceHandle,
    userId: userId,
    role: invitation.role,
    invitedBy: invitation.invitedBy as IdUser,
    createdAt: now,
    updatedAt: now,
  })

  await ctx.db.patch("workspaceInvitations", invitation._id, {
    status: workspaceInvitationStatus.accepted,
    updatedAt: now,
  })

  const userProfile = docUserToUserProfile(user, workspace.workspaceHandle, invitation.role)

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
