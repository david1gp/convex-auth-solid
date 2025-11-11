import { loginMethodValidator } from "@/auth/model/loginMethodValidator"
import { v } from "convex/values"
import { userProfileValidator } from "./UserProfile"

export const userSessionValidator = v.object({
  token: v.string(),
  profile: userProfileValidator,
  hasPw: v.boolean(),
  signedInMethod: loginMethodValidator,
  signedInAt: v.string(),
  expiresAt: v.string(),
})
