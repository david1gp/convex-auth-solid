import { v } from "convex/values"
import { loginMethodValidator } from "~auth/model/loginMethodValidator"
import { userProfileValidator } from "~auth/model/userProfileValidator"

// UserSession validator
export const userSessionValidator = v.object({
  token: v.string(),
  user: userProfileValidator,
  signedInMethod: loginMethodValidator,
  signedInAt: v.string(),
  expiresAt: v.string(),
})
