import { orgRoleValidator } from "@/org/org_model/orgRoleValidator"
import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { generateId12 } from "~utils/ran/generateId12"
import { createResult, type PromiseResult } from "~utils/result/Result"
import type { IdOrgInvitation } from "./IdOrgInvitation"

export const orgInvitationCreateDataFields = {
  // ids
  orgHandle: v.string(),
  invitationCode: v.string(),
  // invited
  invitedName: v.string(),
  invitedEmail: v.string(),
  // data
  role: orgRoleValidator,
  invitedBy: v.string(),
} as const

export const orgInvitationCreateMutationValidator = v.object(orgInvitationCreateDataFields)

export type OrgInvitationCreateMutationValidatorType = typeof orgInvitationCreateMutationValidator.type

export async function orgInvitation21CreateMutationFn(
  ctx: MutationCtx,
  args: OrgInvitationCreateMutationValidatorType,
): PromiseResult<IdOrgInvitation> {
  const invitationCode = generateId12()
  const now = nowIso()
  const newId = await ctx.db.insert("orgInvitations", {
    ...args,
    invitationCode,
    emailSendAt: undefined,
    emailSendAmount: 0,
    acceptedAt: undefined,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(newId)
}
