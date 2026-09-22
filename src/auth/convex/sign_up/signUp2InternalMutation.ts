import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import type { IdAuthUserEmailRegistration } from "#src/auth/convex/IdUser.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { stringSchemaName } from "#src/utils/valibot/stringSchema.ts"
import { nowIso } from "#utils/date/nowIso.js"

const signUpCodeSchemaFields = {
  name: stringSchemaName,
  email: emailSchema,
  hashedPassword: a.optional(a.string()),
  code: a.string(),
} as const

export const signUpCodeFields = valibotToConvex(signUpCodeSchemaFields)

export type SignUpCodeValidatorType = typeof signUpCodeValidator.type
export const signUpCodeValidator = v.object(signUpCodeFields)

export const signUp2InternalMutation = internalMutation({
  args: signUpCodeValidator,
  handler: signUp2InternalMutationFn,
})

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
