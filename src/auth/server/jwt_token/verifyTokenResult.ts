import { type PromiseResult } from "#result"
import { envAuthSecretResult } from "#src/app/env/private/envAuthSecretResult.js"
import type { DecodedToken } from "#src/auth/model/DecodedToken.js"
import { verifyToken } from "#src/auth/server/jwt_token/verifyToken.js"

export async function verifyTokenResult(token: string): PromiseResult<DecodedToken> {
  // env variable
  const secretSalt = envAuthSecretResult()
  if (!secretSalt.success) return secretSalt
  const salt = secretSalt.data
  // token
  return verifyToken(token, salt)
}
