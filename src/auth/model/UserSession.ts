import { loginMethodSchema, type LoginMethod } from "@/auth/model/loginMethod"
import { userProfileSchema, type UserProfile } from "@/auth/model/UserProfile"
import { tokenValidDurationInDays } from "@/auth/server/jwt_token/tokenValidDurationInDays"
import dayjs from "dayjs"
import * as v from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export type UserSession = {
  token: string
  user: UserProfile
  signedInMethod: LoginMethod
  signedInAt: string
  expiresAt: string
}

export const userSessionSchema = v.object({
  token: v.string(),
  user: userProfileSchema,
  signedInMethod: loginMethodSchema,
  signedInAt: dateTimeSchema,
  expiresAt: dateTimeSchema,
})

export const userSessionSchemaFromString = v.pipe(v.string(), v.parseJson(), userSessionSchema)

export function createUserSessionTimes(now = dayjs()): Pick<UserSession, "signedInAt" | "expiresAt"> {
  const signedInAt = now
  const expiresAt = signedInAt.add(tokenValidDurationInDays, "days")
  return { signedInAt: signedInAt.toISOString(), expiresAt: expiresAt.toISOString() }
}

export function userSessionIsStillValid(userSession: UserSession): boolean {
  const expiresAt = dayjs(userSession.expiresAt)
  const now = dayjs()
  const isExpired = expiresAt < now
  return !isExpired
}
