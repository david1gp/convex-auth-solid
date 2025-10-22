import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import type { UserSession } from "@/auth/model/UserSession"
import { createToken } from "@/auth/server/jwt_token/createToken"
import {
  type CommonAuthProvider
} from "@/auth/server/social_identity_providers/CommonAuthProvider.js"
import type { Id } from "@convex/_generated/dataModel"
import { type MutationCtx } from "@convex/_generated/server.js"
import { readEnvVariableResult } from "~utils/env/readEnvVariable.js"
import { createResult, type PromiseResult } from "~utils/result/Result"
import { findOrCreateUserFn } from "../crud/findOrCreateUserFn"
import { saveTokenIntoSessionReturnExpiresAtFn } from "../crud/saveTokenIntoSessionReturnExpiresAtFn"


export async function signInUsingSocialAuth3MutationFn(
  ctx: MutationCtx,
  providerInfo: CommonAuthProvider,
): PromiseResult<UserSession> {
  const op = "signInUsingSocialAuthMutationFn"
  // Find or create user
  const foundOrCreatedResult = await findOrCreateUserFn(ctx, providerInfo)
  if (!foundOrCreatedResult.success) {
    console.log("failed to find user", foundOrCreatedResult.errorMessage)
    return foundOrCreatedResult
  }
  const data = foundOrCreatedResult.data
  const userId = data.user.userId
  // data
  const saltResult = readEnvVariableResult(privateEnvVariableName.AUTH_SECRET)
  if (!saltResult.success) return saltResult
  const salt = saltResult.data
  const token = await createToken(userId, salt)
  await saveTokenIntoSessionReturnExpiresAtFn(ctx, providerInfo.provider, userId as Id<"users">, token)
  // event
  const r: UserSession = {
    token,
    ...data,
  }
  return createResult(r)
}
