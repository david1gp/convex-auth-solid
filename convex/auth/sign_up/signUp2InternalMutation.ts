import type { MutationCtx } from "@convex/_generated/server"
import { internalMutation } from "@convex/_generated/server"
import type { IdAuthUserEmailRegistration } from "@convex/auth/IdUser"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"

export const signUpCodeFields = {
  name: v.string(),
  email: v.string(),
  hashedPassword: v.optional(v.string()),
  code: v.string(),
} as const

export type SignUpCodeValidatorType = typeof signUpCodeValidator.type
export const signUpCodeValidator = v.object(signUpCodeFields)

export const signUp2InternalMutation = internalMutation({
  args: signUpCodeValidator,
  handler: async (ctx: MutationCtx, args: SignUpCodeValidatorType): Promise<{ id: IdAuthUserEmailRegistration }> => {
    return signUp2MutationFn(ctx, args)
  },
})

export async function signUp2MutationFn(
  ctx: MutationCtx,
  args: SignUpCodeValidatorType,
): Promise<{ id: IdAuthUserEmailRegistration }> {
  const { name, email, hashedPassword, code } = args

  const id = await ctx.db.insert("authUserEmailRegistrations", {
    email,
    code,
    name,
    hashedPassword,
    createdAt: nowIso(),
    consumedAt: undefined,
  })

  return { id }
}
