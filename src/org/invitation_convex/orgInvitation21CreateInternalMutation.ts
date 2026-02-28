import { languageValidator } from "@/app/i18n/language"
import { orgRoleValidator } from "@/org/org_model_field/orgRoleValidator"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, type PromiseResult } from "~utils/result/Result"
import type { IdOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"

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
