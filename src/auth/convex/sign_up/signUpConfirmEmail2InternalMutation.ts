import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model/loginMethod"
import { userRole } from "@/auth/model/userRole"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import { type MutationCtx, internalMutation } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"
import { dbUsersToUserProfile } from "../crud/dbUsersToUserProfile"

export type SignUpConfirmValidatorType = typeof signUpConfirmEmailValidator.type
export const signUpConfirmEmailValidator = v.object({
  email: v.string(),
  code: v.string(),
})

export const signUpConfirmEmail2InternalMutation = internalMutation({
  args: signUpConfirmEmailValidator,
  handler: signUpConfirmEmail2InternalMutationFn,
})

export async function signUpConfirmEmail2InternalMutationFn(
  ctx: MutationCtx,
  args: SignUpConfirmValidatorType,
): PromiseResult<UserSession> {
  const op = "signUpConfirm2MutationFn"
  const { email, code } = args

  //
  // 1. Find the registration
  //
  const registration = await ctx.db
    .query("authUserEmailRegistrations")
    .withIndex("emailCode", (q) => q.eq("email", email).eq("code", code))
    .first()

  if (!registration) {
    return createError(op, "Invalid or expired code", code)
  }

  if (registration.consumedAt) {
    return createError(op, "Code already used", code)
  }

  const { name, hashedPassword } = registration
  // if (!hashedPassword) {
  //   return createError(op, "Missing password", code)
  // }

  //
  // 2. Create user
  //
  const now = nowIso()
  const userId = await ctx.db.insert("users", {
    name,
    email,
    emailVerifiedAt: now,
    hashedPassword,
    role: userRole.user,
    createdAt: now,
    deletedAt: undefined,
  })

  //
  // 3. Check for org membership
  //
  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)

  //
  // 4. Create session
  //
  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data
  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, loginMethod.email, userId, token)

  //
  // 5. Mark code as consumed
  //
  await ctx.db.patch(registration._id, { consumedAt: nowIso() })

  //
  // 6. Create user profile
  //
  const createdUser = await ctx.db.get(userId)
  if (!createdUser) {
    return createError(op, "Error finding created user", userId)
  }
  const userProfile = dbUsersToUserProfile(createdUser, orgHandle, orgRole)

  //
  // 7. Create and return user session
  //
  const userSession: UserSession = {
    token,
    user: userProfile,
    signedInMethod: loginMethod.email,
    signedInAt: nowIso(),
    expiresAt,
  }

  return createResult(userSession)
}
