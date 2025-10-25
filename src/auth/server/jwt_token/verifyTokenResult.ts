import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import type { DecodedToken } from "@/auth/model/DecodedToken"
import { verifyToken } from "@/auth/server/jwt_token/verifyToken"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import type { PromiseResult } from "~utils/result/Result"

export async function verifyTokenResult(token: string): PromiseResult<DecodedToken> {
  // env variable
  const secretSalt = readEnvVariableResult(privateEnvVariableName.AUTH_SECRET)
  if (!secretSalt.success) return secretSalt
  const salt = secretSalt.data
  // token
  return verifyToken(token, salt)
}
