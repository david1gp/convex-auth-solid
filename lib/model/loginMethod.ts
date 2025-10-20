import * as v from "valibot"
import { loginProvider } from "~auth/model/socialLoginProvider"

export type LoginMethod = keyof typeof loginMethod

export const loginMethod = {
  email: "email",
  password: "password",
  ...loginProvider,
} as const

export const loginMethodSchema = v.enum(loginMethod)
