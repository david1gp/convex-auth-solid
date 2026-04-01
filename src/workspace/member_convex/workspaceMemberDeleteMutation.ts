import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { v } from "convex/values"

export type WorkspaceMemberDeleteValidatorType = typeof workspaceMemberDeleteValidator.type

export const workspaceMemberDeleteFields = {
  memberId: v.string(),
  workspaceHandle: v.string(),
} as const

export const workspaceMemberDeleteValidator = v.object(workspaceMemberDeleteFields)

export const workspaceMemberDeleteMutation = mutation({
  args: createTokenValidator(workspaceMemberDeleteFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, workspaceMemberDeleteFn),
})

export async function workspaceMemberDeleteFn(ctx: MutationCtx, args: WorkspaceMemberDeleteValidatorType): PromiseResult<null> {
  const op = "workspaceMemberDeleteFn"

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  const member = await ctx.db.get("workspaceMembers", args.memberId as IdWorkspaceMember)
  if (!member || member.workspaceId !== workspace._id) {
    return createResult(null) // idempotent
  }

  await ctx.db.delete("workspaceMembers", args.memberId as IdWorkspaceMember)
  return createResult(null)
}
