import { internalQuery, query, type QueryCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { docWorkspaceInvitationToModel } from "#src/workspace/invitation_convex/docWorkspaceInvitationToModel.ts"
import type { DocWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { v } from "convex/values"

export const workspaceInvitationGetFields = {
  workspaceHandle: v.optional(v.string()),
  invitationCode: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type WorkspaceInvitationGetValidatorType = typeof workspaceInvitationGetValidator.type
export const workspaceInvitationGetValidator = v.object(workspaceInvitationGetFields)

export const workspaceInvitationGetQuery = query({
  args: workspaceInvitationGetValidator,
  handler: workspaceInvitationGetFn,
})

export const workspaceInvitationGetInternalQuery = internalQuery({
  args: workspaceInvitationGetValidator,
  handler: workspaceInvitationGetInternalFn,
})

export async function workspaceInvitationGetFn(
  ctx: QueryCtx,
  args: WorkspaceInvitationGetValidatorType,
): PromiseResult<WorkspaceInvitationModel | null> {
  const op = "workspaceInvitationGetFn"

  const got = await workspaceInvitationGetInternalFn(ctx, args)
  if (!got.success) return got
  if (!got.data) return got
  return createResult(docWorkspaceInvitationToModel(got.data))
}

export async function workspaceInvitationGetInternalFn(
  ctx: QueryCtx,
  args: WorkspaceInvitationGetValidatorType,
): PromiseResult<DocWorkspaceInvitation | null> {
  const op = "workspaceInvitationGetFn"

  if (!args.invitationCode) {
    return createResultError(op, "Missing invitation code", args.invitationCode)
  }

  const invitation = await ctx.db
    .query("workspaceInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()

  if (!invitation) {
    return createResultError(op, "Invalid invitation code", args.invitationCode)
  }
  if (args.updatedAt === invitation.updatedAt) {
    return createResult(null)
  }
  return createResult(invitation)
}
