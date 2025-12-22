import { orgInvitationDataSchemaFields } from "@/org/invitation_model/orgInvitationSchema"
import { orgRoleValidator } from "@/org/org_model_field/orgRoleValidator"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as va from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"
import type { DocOrgInvitation } from "./IdOrgInvitation"

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
  acceptedAt: v.optional(v.string()),
} as const

// export const orgInvitationUpdateFields = {
//   _id: vIdOrgInvitation,
//   ...orgInvitationFields,
// } as const

export const orgInvitationUpdateValidator = v.object(orgInvitationUpdateFields)

export const orgInvitationUpdateInternalMutation = internalMutation({
  args: orgInvitationUpdateValidator,
  handler: orgInvitation33UpdateFn,
})

export async function orgInvitation33UpdateFn(
  ctx: MutationCtx,
  args: OrgInvitationUpdateValidatorType,
): PromiseResult<null> {
  const op = "orgInvitationUpdateFn"

  const schema = va.partial(va.object(orgInvitationDataSchemaFields))
  const parse = va.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, va.summarize(parse.issues))
  }

  const patch: Partial<DocOrgInvitation> = { ...parse.output }

  if (!patch.updatedAt) {
    patch.updatedAt = nowIso()
  }

  await ctx.db.patch(args._id, patch)
  return createResult(null)
}
