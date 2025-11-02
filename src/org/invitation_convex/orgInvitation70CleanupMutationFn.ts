import type { MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export type OrgInvitationCleanupValidatorType = typeof orgInvitationCleanupValidator.type

export const orgInvitationCleanupFields = {} as const

export const orgInvitationCleanupValidator = v.object(orgInvitationCleanupFields)

export async function orgInvitation70CleanupMutationFn(
  ctx: MutationCtx,
  args: OrgInvitationCleanupValidatorType,
): PromiseResult<number> {
  const op = "orgInvitationCleanupFn"

  // Calculate cutoff date: 24 hours ago
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  // Query for accepted invitations older than 24 hours
  const oldAcceptedInvitations = await ctx.db
    .query("orgInvitations")
    .filter((q) => q.and(q.neq(q.field("acceptedAt"), undefined), q.lt(q.field("acceptedAt"), cutoffDate)))
    .collect()

  // Delete each old invitation
  let deletedCount = 0
  for (const invitation of oldAcceptedInvitations) {
    await ctx.db.delete(invitation._id)
    deletedCount++
  }

  return createResult(deletedCount)
}
