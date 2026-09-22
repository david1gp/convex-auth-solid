import { v } from "convex/values"
import * as a from "valibot"
import { type MutationCtx, mutation } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import type { DocWorkspaceMember, IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import { workspaceMemberDataSchemaFields } from "#src/workspace/member_model/WorkspaceMemberSchema.ts"
import { nowIso } from "#utils/date/nowIso.js"

export type WorkspaceMemberEditValidatorType = typeof workspaceMemberEditValidator.type

export const workspaceMemberEditFields = valibotToConvex({
  memberId: a.string(),
  workspaceHandle: workspaceMemberDataSchemaFields.workspaceHandle,
  role: a.optional(workspaceMemberDataSchemaFields.role),
})

export const workspaceMemberEditValidator = v.object(workspaceMemberEditFields)

export const workspaceMemberEditMutation = mutation({
  args: createTokenValidator(workspaceMemberEditFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, workspaceMemberEditFn),
})

export async function workspaceMemberEditFn(
  ctx: MutationCtx,
  args: WorkspaceMemberEditValidatorType,
): PromiseResult<null> {
  const op = "workspaceMemberEditFn"

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("workspaceHandle", (q) => q.eq("workspaceHandle", args.workspaceHandle))
    .unique()
  if (!workspace) {
    return createResultError(op, "Workspace not found", args.workspaceHandle)
  }

  const member = await ctx.db.get("workspaceMembers", args.memberId as IdWorkspaceMember)
  if (!member || member.workspaceId !== workspace._id) {
    return createResultError(op, "Workspace member not found", args.memberId)
  }
  const { workspaceHandle, memberId, ...partial } = args
  const patch: Partial<DocWorkspaceMember> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch("workspaceMembers", args.memberId as IdWorkspaceMember, patch)
  return createResult(null)
}
