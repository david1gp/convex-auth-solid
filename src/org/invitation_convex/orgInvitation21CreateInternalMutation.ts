import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import { languageSchema } from "#src/app/i18n/language.ts"
import type { IdOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.ts"
import { orgInvitationDataSchemaFields } from "#src/org/invitation_model/orgInvitationSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { nowIso } from "#utils/date/nowIso.js"

export const orgInvitationCreateDataFields = valibotToConvex({
  orgHandle: orgInvitationDataSchemaFields.orgHandle,
  invitationCode: a.string(),
  invitedName: orgInvitationDataSchemaFields.invitedName,
  invitedEmail: orgInvitationDataSchemaFields.invitedEmail,
  l: languageSchema,
  role: orgInvitationDataSchemaFields.role,
  invitedBy: a.string(),
})

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
