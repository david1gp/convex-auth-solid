import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createToken } from "@/auth/server/jwt_token/createToken"
import { tokenValidDurationInDays } from "@/auth/server/jwt_token/tokenValidDurationInDays"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function createTokenResult(
  userId: string,
  expiresInDays = tokenValidDurationInDays,
): PromiseResult<string> {
  const op = "createTokenResult"
  console.log(op, userId)
  // env variable
  const saltResult = readEnvVariableResult(privateEnvVariableName.AUTH_SECRET)
  if (!saltResult.success) return saltResult
  const salt = saltResult.data
  // token
  const token = await createToken(userId, salt, expiresInDays)
  if (!token) return createError(op, "empty salt")
  return createResult(token)
}
