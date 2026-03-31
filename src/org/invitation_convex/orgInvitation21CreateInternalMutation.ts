import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import { languageValidator } from "#src/app/i18n/language.ts"
import type { IdOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.ts"
import { orgRoleValidator } from "#src/org/org_model_field/orgRoleValidator.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

export const orgInvitationCreateDataFields = {
  // ids
  orgHandle: v.string(),
  invitationCode: v.string(),
  // invited
  invitedName: v.string(),
  invitedEmail: v.string(),
  l: languageValidator,
  // data
  role: orgRoleValidator,
  invitedBy: v.string(),
} as const

export const orgInvitationCreateMutationValidator = v.object(orgInvitationCreateDataFields)

export type OrgInvitationCreateMutationValidatorType = typeof orgInvitationCreateMutationValidator.type

export const orgInvitation21CreateInternalMutation = internalMutation({
  args: orgInvitationCreateMutationValidator,
  handler: orgInvitation21CreateMutationFn,
})

export async function orgInvitation21CreateMutationFn(
  ctx: MutationCtx,
  args: OrgInvitationCreateMutationValidatorType,
): PromiseResult<IdOrgInvitation> {
  const now = nowIso()
  const newId = await ctx.db.insert("orgInvitations", {
    ...args,
    emailSendAt: undefined,
    emailSendAmount: 0,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(newId)
}
