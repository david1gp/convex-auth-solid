import { v } from "convex/values"
import * as a from "valibot"
import { type MutationCtx, mutation } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { workspaceInvitationStatus } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { nowIso } from "#utils/date/nowIso.js"

export type WorkspaceInvitationDismissValidatorType = typeof workspaceInvitationDismissValidator.type

export const workspaceInvitationDismissFields = valibotToConvex({ invitationCode: a.string() })

export const workspaceInvitationDismissValidator = v.object(workspaceInvitationDismissFields)

export const workspaceInvitation60DismissMutation = mutation({
  args: createTokenValidator(workspaceInvitationDismissFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, workspaceInvitation60DismissMutationFn),
})

export async function workspaceInvitation60DismissMutationFn(
  ctx: MutationCtx,
  args: WorkspaceInvitationDismissValidatorType,
): PromiseResult<null> {
  const op = "workspaceInvitationDismissFn"

  const invitation = await ctx.db
    .query("workspaceInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()
  if (!invitation) {
    return createResultError(op, "Invitation not found", args.invitationCode)
  }

  const now = nowIso()
  await ctx.db.patch("workspaceInvitations", invitation._id, {
    status: workspaceInvitationStatus.dismissed,
    updatedAt: now,
  })

  return createResult(null)
}
