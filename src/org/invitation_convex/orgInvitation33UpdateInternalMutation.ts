import { createError, createResult, type PromiseResult } from "#result"
import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.js"
import { orgInvitationDataSchemaFields } from "#src/org/invitation_model/orgInvitationSchema.js"
import { orgRoleValidator } from "#src/org/org_model_field/orgRoleValidator.js"
import { nowIso } from "#utils/date/nowIso"
import { internalMutation, type MutationCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"
import * as a from "valibot"

export type OrgInvitationUpdateValidatorType = typeof orgInvitationUpdateValidator.type

export const orgInvitationUpdateFields = {
  // token: v.string(),
  _id: v.id("orgInvitations"),
  // data
  orgHandle: v.optional(v.string()),
  invitedEmail: v.optional(v.string()),
  invitationCode: v.optional(v.string()),
  role: v.optional(orgRoleValidator),
  invitedBy: v.optional(v.string()),
  emailSendAt: v.optional(v.string()),
  emailSendAmount: v.optional(v.number()),
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
