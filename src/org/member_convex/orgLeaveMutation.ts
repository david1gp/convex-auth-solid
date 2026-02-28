import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { createUserIdValidator } from "@/utils/convex_backend/createUserIdValidator"
import { internal } from "@convex/_generated/api"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model_field/loginMethod"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { nowIso } from "~utils/date/nowIso"

export const orgLeaveFields = {
  orgHandle: v.string(),
} as const

export const orgLeaveValidator = createUserIdValidator(orgLeaveFields)

export type OrgLeaveValidatorType = typeof orgLeaveValidator.type

export const orgLeaveMutation = mutation({
  args: createTokenValidator(orgLeaveFields),
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, orgLeaveFn),
})

export async function orgLeaveFn(ctx: MutationCtx, args: OrgLeaveValidatorType): PromiseResult<UserSession> {
  const op = "orgLeaveFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const member = await ctx.db
    .query("orgMembers")
    .withIndex("userId", (q) => q.eq("userId", args.userId))
    .filter((q) => q.eq(q.field("orgId"), org._id))
    .first()

  if (!member) {
    return createResultError(op, "Member not found", args.userId)
  }

  await ctx.db.delete("orgMembers", member._id)

  await ctx.runMutation(internal.org.orgCleanupIfEmptyInternalMutation, {
    orgHandle: args.orgHandle,
  })

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
