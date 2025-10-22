import { loginMethodValidator } from "@/auth/model/loginMethodValidator"
import { userProfileValidator } from "@/auth/model/userProfileValidator"
import { v } from "convex/values"

// UserSession validator
export const userSessionValidator = v.object({
  token: v.string(),
  user: userProfileValidator,
  signedInMethod: loginMethodValidator,
  signedInAt: v.string(),
  expiresAt: v.string(),
})
