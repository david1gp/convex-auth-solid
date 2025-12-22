import { userProfileSchema, type UserProfile } from "@/auth/model/UserProfile"
import { loginMethodSchema, type LoginMethod } from "@/auth/model_field/loginMethod"
import { tokenValidDurationInDays } from "@/auth/server/jwt_token/tokenValidDurationInDays"
import dayjs from "dayjs"
import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export type UserSession = {
  token: string
  profile: UserProfile
  hasPw: boolean
  signedInMethod: LoginMethod
  signedInAt: string
  expiresAt: string
}

export const userSessionSchema = a.object({
  token: a.string(),
  profile: userProfileSchema,
  hasPw: a.boolean(),
  signedInMethod: loginMethodSchema,
  signedInAt: dateTimeSchema,
  expiresAt: dateTimeSchema,
})

export const userSessionSchemaFromString = a.pipe(a.string(), a.parseJson(), userSessionSchema)

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
