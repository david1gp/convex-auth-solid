import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { saveTokenIntoSessionReturnExpiresAtFn } from "#src/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation.ts"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"
import type { IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import { loginMethod } from "#src/auth/model_field/loginMethod.ts"
import { createTokenResult } from "#src/auth/server/jwt_token/createTokenResult.ts"
import { authMutationTokenToUserId } from "#src/utils/convex_backend/authMutationTokenToUserId.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { createUserIdValidator } from "#src/utils/convex_backend/createUserIdValidator.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

export const workspaceLeaveFields = {
  workspaceHandle: v.string(),
} as const

export const workspaceLeaveValidator = createUserIdValidator(workspaceLeaveFields)

export type WorkspaceLeaveValidatorType = typeof workspaceLeaveValidator.type

export const workspaceMemberLeaveMutation = mutation({
  args: createTokenValidator(workspaceLeaveFields),
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, workspaceLeaveFn),
})

export async function workspaceLeaveFn(ctx: MutationCtx, args: WorkspaceLeaveValidatorType): PromiseResult<UserSession> {
  const op = "workspaceLeaveFn"

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  const member = await ctx.db
    .query("workspaceMembers")
    .withIndex("userId", (q) => q.eq("userId", args.userId))
    .filter((q) => q.eq(q.field("workspaceId"), workspace._id))
    .first()

  if (!member) {
    return createResultError(op, "Member not found", args.userId)
  }

  await ctx.db.delete("workspaceMembers", member._id as IdWorkspaceMember)

  const user = await ctx.db.get("users", args.userId)
  if (!user) {
    return createResultError(op, "User not found", args.userId)
  }

  const tokenResult = await createTokenResult(args.userId, undefined, undefined)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data

  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, args.userId, token, nowIso())

  const userProfile = docUserToUserProfile(user, undefined, undefined)

  const userSession: UserSession = {
    token,
    profile: userProfile,
    hasPw: !!user.hashedPassword,
    signedInMethod: loginMethod.email,
    signedInAt: nowIso(),
    expiresAt,
  }

  return createResult(userSession)
}