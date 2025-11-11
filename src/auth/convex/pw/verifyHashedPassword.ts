import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { hashPassword } from "@/auth/convex/pw/hashPassword"
import { envAuthSecretResult } from "@/app/env/private/envAuthSecretResult"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function verifyHashedPassword2(password: string, hash: string): PromiseResult<boolean> {
  const op = "verifyHashedPassword2"
  const saltResult = envAuthSecretResult()
  if (!saltResult.success) return saltResult
  const salt = saltResult.data
  if (!salt) return createError(op, "AUTH_SECRET not defined")
  return createResult(await verifyHashedPassword(password, hash, salt))
}

export async function verifyHashedPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const computedHash = await hashPassword(password, salt)
  return computedHash === hash
}
