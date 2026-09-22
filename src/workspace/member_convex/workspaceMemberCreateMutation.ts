import { v } from "convex/values"
import * as a from "valibot"
import { type MutationCtx, mutation } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { vIdUser } from "#src/auth/convex/vIdUser.ts"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.ts"
import type { IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import { workspaceMemberDataSchemaFields } from "#src/workspace/member_model/WorkspaceMemberSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { nowIso } from "#utils/date/nowIso.js"

export type WorkspaceMemberCreateValidatorType = typeof workspaceMemberCreateValidator.type

export const workspaceMemberCreateFields = {
  ...valibotToConvex({
    token: a.string(),
    workspaceHandle: workspaceMemberDataSchemaFields.workspaceHandle,
    role: workspaceMemberDataSchemaFields.role,
  }),
  userId: vIdUser,
} as const

export const workspaceMemberCreateValidator = v.object(workspaceMemberCreateFields)

export const workspaceMemberCreateMutation = mutation({
  args: workspaceMemberCreateValidator,
  handler: workspaceMemberCreateFn,
})

export async function workspaceMemberCreateFn(
  ctx: MutationCtx,
  args: WorkspaceMemberCreateValidatorType,
): PromiseResult<IdWorkspaceMember> {
  const op = "workspaceMemberCreateFn"

  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const invitedBy = verifiedResult.data

  const user = await ctx.db.get("users", args.userId)
  if (!user) {
    const errorMessage = "user not found"
    console.info(op, errorMessage, args.userId)
    return createResultError(op, errorMessage, args.userId)
  }

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  const now = nowIso()
  const workspaceMemberId = await ctx.db.insert("workspaceMembers", {
    workspaceId: workspace._id,
    workspaceHandle: workspace.workspaceHandle,
    userId: args.userId,
    role: args.role,
    invitedBy: invitedBy,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(workspaceMemberId)
}
