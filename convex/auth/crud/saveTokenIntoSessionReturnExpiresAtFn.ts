import type { Id } from "@convex/_generated/dataModel"
import type { MutationCtx } from "@convex/_generated/server"
import dayjs from "dayjs"
import type { LoginMethod } from "~auth/model/loginMethod"
import { tokenValidDurationInDays } from "~auth/server/jwt_token/tokenValidDurationInDays"

export async function saveTokenIntoSessionReturnExpiresAtFn(
  ctx: MutationCtx,
  loginMethod: LoginMethod,
  userId: Id<"users">,
  token: string,
  now: string = new Date().toISOString(),
): Promise<string> {
  const expiresAt = dayjs(now).add(tokenValidDurationInDays, "days").toISOString()
  ctx.db.insert("authSessions", {
    userId: userId,
    // data
    loginMethod: loginMethod,
    token,
    // meta dates
    createdAt: now,
    updatedAt: now,
    expiresAt: expiresAt,
  })
  return expiresAt
}
