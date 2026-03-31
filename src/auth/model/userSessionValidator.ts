import { userProfileValidator } from "#src/auth/model/UserProfile.ts"
import { loginMethodValidator } from "#src/auth/model_field/loginMethodValidator.ts"
import { v } from "convex/values"

export const userSessionValidator = v.object({
  token: v.string(),
  profile: userProfileValidator,
  hasPw: v.boolean(),
  signedInMethod: loginMethodValidator,
  signedInAt: v.string(),
  expiresAt: v.string(),
})
