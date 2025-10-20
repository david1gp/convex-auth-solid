import { internalMutation } from "@convex/_generated/server"
import { saveTokenIntoSessionReturnExpiresAtFn } from "@convex/auth/crud/saveTokenIntoSessionReturnExpiresAtFn"
import { v } from "convex/values"
import { loginMethodValidator } from "~auth/model/loginMethodValidator"
import { vIdUsers } from "../vIdUSers"

export type AuthSessionInsertValidatorType = typeof authSessionInsertValidator.type
export const authSessionInsertValidator = v.object({
  userId: vIdUsers,
  loginMethod: loginMethodValidator,
  token: v.string(),
})

export const authSessionInsertInternalMutation = internalMutation({
  args: authSessionInsertValidator,
  handler: async (ctx, args) => {
    return saveTokenIntoSessionReturnExpiresAtFn(ctx, args.loginMethod, args.userId, args.token)
  },
})
