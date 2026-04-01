import { internal } from "#convex/_generated/api.js"
import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { findUserByEmailFn } from "#src/auth/convex/crud/findUserByEmailQuery.ts"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.ts"
import { workspaceInvitation21CreateMutationFn } from "#src/workspace/invitation_convex/workspaceInvitation21CreateInternalMutation.ts"
import { workspaceMemberGetByUserIdFn } from "#src/workspace/member_convex/workspaceMemberGetByUserIdFn.ts"
import { workspaceRoleValidator } from "#src/workspace/workspace_model_field/workspaceRoleValidator.ts"
import { generateId12 } from "#utils/ran/generateId12.js"
import { v } from "convex/values"

export type WorkspaceInvitationCreateValidatorType = typeof workspaceInvitationCreateActionValidator.type

export const workspaceInvitationInitMutationFields = {
  token: v.string(),
  workspaceHandle: v.string(),
  invitedEmail: v.string(),
  role: workspaceRoleValidator,
} as const

export const workspaceInvitationCreateActionValidator = v.object(workspaceInvitationInitMutationFields)

export const workspaceInvitation20InitMutation = mutation({
  args: workspaceInvitationCreateActionValidator,
  handler: workspaceInvitation20InitMutationFn,
})

export async function workspaceInvitation20InitMutationFn(
  ctx: MutationCtx,
  args: WorkspaceInvitationCreateValidatorType,
): PromiseResult<string> {
  const op = "workspaceInvitation20InitMutationFn"

  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const invitedBy = verifiedResult.data

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  const existingInvitation = await ctx.db
    .query("workspaceInvitations")
    .withIndex("invitedEmail", (q) => q.eq("invitedEmail", args.invitedEmail))
    .first()

  const invitedUser = await findUserByEmailFn(ctx, args.invitedEmail)
  if (invitedUser) {
    const existingMember = await workspaceMemberGetByUserIdFn(ctx, invitedUser._id)
    if (existingMember && existingMember.workspaceHandle === args.workspaceHandle) {
      return createResultError(op, "User is already a member of this workspace", args.invitedEmail)
    }
  }

  const invitationCode = generateId12()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  await workspaceInvitation21CreateMutationFn(ctx, {
    invitationCode: invitationCode,
    invitedBy: invitedBy,
    invitedEmail: args.invitedEmail,
    workspaceHandle: args.workspaceHandle,
    role: args.role,
    status: "pending",
    expiresAt: expiresAt,
  })

  await ctx.scheduler.runAfter(
    0,
    internal.workspace.workspaceInvitation31SendInternalAction,
    { token: args.token, invitationCode },
  )

  return createResult(invitationCode)
}
