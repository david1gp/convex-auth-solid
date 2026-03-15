import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import { type PromiseResult, createResult } from "~result"

export async function verifyTokenGetUserId(token: string): PromiseResult<IdUser> {
  const decoded = await verifyTokenResult(token)
  if (!decoded.success) return decoded
  return createResult(decoded.data.sub as IdUser)
}