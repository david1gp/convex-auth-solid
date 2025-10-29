import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { createToken } from "@/auth/server/jwt_token/createToken"
import { tokenValidDurationInDays } from "@/auth/server/jwt_token/tokenValidDurationInDays"
import type { OrgRole } from "@/org/org_model/orgRole"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function createTokenResult(userId: string, orgHandle?: string, orgRole?: OrgRole): PromiseResult<string> {
  const expiresInDays = tokenValidDurationInDays
  const op = "createTokenResult"
  console.log(op, userId)
  // env variable
  const saltResult = readEnvVariableResult(privateEnvVariableName.AUTH_SECRET)
  if (!saltResult.success) return saltResult
  const salt = saltResult.data
  // token
  const payload: Record<string, string> = {}
  if (orgHandle) payload.orgHandle = orgHandle
  if (orgRole) payload.orgRole = orgRole
  const token = await createToken(userId, salt, payload, expiresInDays)
  if (!token) return createError(op, "empty salt")
  return createResult(token)
}
