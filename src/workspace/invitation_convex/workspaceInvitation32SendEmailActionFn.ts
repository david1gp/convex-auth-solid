import { createResult, createResultError, type PromiseResult } from "#result"
import { envBaseUrlAppResult } from "#src/app/env/public/envBaseUrlAppResult.ts"
import { workspaceRoleValidator } from "#src/workspace/workspace_model_field/workspaceRoleValidator.ts"
import { v } from "convex/values"

export type WorkspaceInvitationSendEmailValidatorType = typeof workspaceInvitationSendEmailValidator.type

export const workspaceInvitationSendEmailFields = {
  workspaceHandle: v.string(),
  invitationCode: v.string(),
  invitedEmail: v.string(),
  invitedByName: v.string(),
  invitedByEmail: v.string(),
  workspaceName: v.string(),
  role: workspaceRoleValidator,
}

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
