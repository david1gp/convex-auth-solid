import { loginProvider } from "@/auth/model_field/socialLoginProvider"
import * as a from "valibot"

export type LoginMethod = keyof typeof loginMethod

export const loginMethod = {
  email: "email",
  password: "password",
  ...loginProvider,
} as const

export const loginMethodSchema = a.enum(loginMethod)
