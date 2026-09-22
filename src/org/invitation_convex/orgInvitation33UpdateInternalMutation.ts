import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import { createError, createResult, type PromiseResult } from "#result"
import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.ts"
import { orgInvitationDataSchemaFields } from "#src/org/invitation_model/orgInvitationSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { nowIso } from "#utils/date/nowIso.js"

export type OrgInvitationUpdateValidatorType = typeof orgInvitationUpdateValidator.type

export const orgInvitationUpdateFields = {
  // token: v.string(),
  _id: v.id("orgInvitations"),
  ...valibotToConvex({
    orgHandle: a.optional(orgInvitationDataSchemaFields.orgHandle),
    invitedEmail: a.optional(orgInvitationDataSchemaFields.invitedEmail),
    invitationCode: a.optional(orgInvitationDataSchemaFields.invitationCode),
    role: a.optional(orgInvitationDataSchemaFields.role),
    invitedBy: a.optional(orgInvitationDataSchemaFields.invitedBy),
    emailSendAt: a.optional(orgInvitationDataSchemaFields.emailSendAt),
    emailSendAmount: a.optional(orgInvitationDataSchemaFields.emailSendAmount),
  }),
} as const

// export const orgInvitationUpdateFields = {
//   _id: vIdOrgInvitation,
//   ...orgInvitationFields,
// } as const

export const orgInvitationUpdateValidator = v.object(orgInvitationUpdateFields)

export const orgInvitation33UpdateInternalMutation = internalMutation({
  args: orgInvitationUpdateValidator,
  handler: orgInvitation33UpdateFn,
})

export async function orgInvitation33UpdateFn(
  ctx: MutationCtx,
  args: OrgInvitationUpdateValidatorType,
): PromiseResult<null> {
  const op = "orgInvitationUpdateFn"

  const schema = a.partial(a.object(orgInvitationDataSchemaFields))
  const parse = a.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, a.summarize(parse.issues))
  }

  const patch: Partial<DocOrgInvitation> = { ...parse.output }

  if (!patch.updatedAt) {
    patch.updatedAt = nowIso()
  }

  await ctx.db.patch("orgInvitations", args._id, patch)
  return createResult(null)
}
