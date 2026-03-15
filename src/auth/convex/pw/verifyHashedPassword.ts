import { envAuthSecretResult } from "@/app/env/private/envAuthSecretResult"
import { hashPassword } from "@/auth/convex/pw/hashPassword"
import { createError, createResult, type PromiseResult } from "~result"

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
