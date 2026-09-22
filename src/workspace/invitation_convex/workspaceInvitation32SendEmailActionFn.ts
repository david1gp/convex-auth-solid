import { v } from "convex/values"
import * as a from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"
import { envBaseUrlAppResult } from "#src/app/env/public/envBaseUrlAppResult.ts"
import { workspaceInvitationDataSchemaFields } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"

export type WorkspaceInvitationSendEmailValidatorType = typeof workspaceInvitationSendEmailValidator.type

export const workspaceInvitationSendEmailFields = valibotToConvex({
  workspaceHandle: a.string(),
  invitationCode: a.string(),
  invitedEmail: a.string(),
  invitedByName: a.string(),
  invitedByEmail: a.string(),
  workspaceName: a.string(),
  role: workspaceInvitationDataSchemaFields.role,
})

export const workspaceInvitationSendEmailValidator = v.object(workspaceInvitationSendEmailFields)

export async function workspaceInvitation32SendEmailActionFn(
  ctx: unknown,
  args: WorkspaceInvitationSendEmailValidatorType,
): PromiseResult<null> {
  const op = "workspaceInvitation32SendEmailActionFn"
  const baseUrlAppResult = envBaseUrlAppResult()
  if (!baseUrlAppResult.success) {
    return baseUrlAppResult
  }
  const baseUrlApp = baseUrlAppResult.data

  console.info(op, "workspace invitation email would be sent to:", args.invitedEmail)
  console.info(op, "workspace:", args.workspaceName, "handle:", args.workspaceHandle)
  console.info(op, "invited by:", args.invitedByName, args.invitedByEmail)
  console.info(op, "invitation code:", args.invitationCode)

  return createResult(null)
}
