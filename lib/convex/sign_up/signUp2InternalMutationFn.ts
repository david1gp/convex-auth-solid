import type { MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import type { IdAuthUserEmailRegistration } from "~auth/convex/IdUser"
import { nowIso } from "~utils/date/nowIso"

export const signUpCodeFields = {
  name: v.string(),
  email: v.string(),
  hashedPassword: v.optional(v.string()),
  code: v.string(),
} as const

export type SignUpCodeValidatorType = typeof signUpCodeValidator.type
export const signUpCodeValidator = v.object(signUpCodeFields)

export async function signUp2InternalMutationFn(
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
