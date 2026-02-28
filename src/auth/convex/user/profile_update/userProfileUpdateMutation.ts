import { saveTokenIntoSessionReturnExpiresAtFn } from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtMutation"
import type { IdUser } from "@/auth/convex/IdUser"
import {
  type UserProfileFieldsTypeInternal,
  userProfileUpdateInternalFn,
} from "@/auth/convex/user/profile_update/userProfileUpdateMutationInternal"
import type { UserProfile } from "@/auth/model/UserProfile"
import type { UserSession } from "@/auth/model/UserSession"
import { type LoginMethod, loginMethod } from "@/auth/model_field/loginMethod"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import type { OrgRole } from "@/org/org_model_field/orgRole"
import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { type MutationCtx, mutation } from "@convex/_generated/server"
import { nowIso } from "~utils/date/nowIso"
import { type PromiseResult, createResult } from "~utils/result/Result"
import { userProfileUpdateFields } from "./userProfileUpdate"

export const userProfileFieldsValidatorPublic = createTokenValidator(userProfileUpdateFields)
export type UserProfileFieldsTypePublic = typeof userProfileFieldsValidatorPublic.type

export const userProfileUpdateMutation = mutation({
  args: userProfileFieldsValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userProfileUpdatePublicFn),
})

async function userProfileUpdatePublicFn(
  ctx: MutationCtx,
  args: Omit<UserProfileFieldsTypeInternal, "token"> & { userId: IdUser },
): PromiseResult<UserSession | null> {
  const op = "userProfileUpdatePublicFn"
  console.log(op, args)

  const userProfileResult = await userProfileUpdateInternalFn(ctx, args)
  if (!userProfileResult.success) {
    return userProfileResult
  }
  if (!userProfileResult.data) {
    return createResult(null)
  }
  return createUserSessionResult(
    ctx,
    args.userId,
    userProfileResult.data,
    loginMethod.email,
    userProfileResult.data.orgHandle,
    userProfileResult.data.orgRole,
  )
}

async function createUserSessionResult(
  ctx: MutationCtx,
  userId: IdUser,
  userProfile: UserProfile,
  signedInMethod: LoginMethod,
  orgHandle?: string,
  orgRole?: OrgRole,
): PromiseResult<UserSession> {
  const op = "createUserSessionResult"

  const tokenResult = await createTokenResult(userId, orgHandle, orgRole)
  if (!tokenResult.success) {
    return tokenResult
  }
  const token = tokenResult.data

  const expiresAt = await saveTokenIntoSessionReturnExpiresAtFn(ctx, signedInMethod, userId, token, nowIso())

  const userSession: UserSession = {
    token,
    profile: userProfile,
    hasPw: !!userProfile.email,
    signedInMethod,
    signedInAt: nowIso(),
    expiresAt,
  }

  return createResult(userSession)
}
