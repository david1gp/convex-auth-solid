import { envAuthSecretResult } from "@/app/env/private/envAuthSecretResult"
import type { DecodedToken } from "@/auth/model/DecodedToken"
import { verifyToken } from "@/auth/server/jwt_token/verifyToken"
import type { PromiseResult } from "~result"

export async function verifyTokenResult(token: string): PromiseResult<DecodedToken> {
  // env variable
  const secretSalt = envAuthSecretResult()
  if (!secretSalt.success) return secretSalt
  const salt = secretSalt.data
  // token
  return verifyToken(token, salt)
}
