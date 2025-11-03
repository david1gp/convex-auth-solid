import { getBaseUrlApp } from "@/app/url/getBaseUrl"
import {
  sendEmailOrgInvitation,
  type GenerateEmailOrgInvitationProps,
} from "@/auth/convex/email/sendEmailOrgInvitation"
import type { OrgInvitationDataModel } from "@/org/invitation_model/OrgInvitationModel"
import { urlOrgInvitationAccept } from "@/org/invitation_url/urlOrgInvitation"
import { orgRoleValidator } from "@/org/org_model/orgRoleValidator"
import { api, internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgInvitationSendEmailValidatorType = typeof orgInvitationSendEmailValidator.type

export const orgInvitationSendEmailFields = {
  // token: v.string(),
  // id
  orgHandle: v.string(),
  // data
  invitationCode: v.string(),
  // invite
  invitedName: v.string(),
  invitedEmail: v.string(),
  // by
  invitedByName: v.string(),
  invitedByEmail: v.string(),
  // org
  orgName: v.string(),
  role: orgRoleValidator,
}

export const orgInvitationSendEmailValidator = v.object(orgInvitationSendEmailFields)

export async function orgInvitation32SendEmailActionFn(
  ctx: ActionCtx,
  args: OrgInvitationSendEmailValidatorType,
): PromiseResult<null> {
  const op = "orgInvitationSendEmailFn"
  const baseUrlApp = getBaseUrlApp()
  if (!baseUrlApp) {
    return createResultError(op, "!getBaseUrlApp")
  }
  const emailProps: GenerateEmailOrgInvitationProps = {
    // invite
    invitedName: args.invitedName,
    // by
    invitedByName: args.invitedByName,
    invitedByEmail: args.invitedByEmail,
    // data
    orgName: args.orgName,
    url: baseUrlApp + urlOrgInvitationAccept(args.orgHandle, args.invitationCode),
  }
  const emailResult = await sendEmailOrgInvitation(args.invitedEmail, emailProps)
  if (!emailResult.success) {
    console.error("Failed to send invitation email", emailResult)
    return emailResult
  }

  const invitationResult = await ctx.runQuery(api.org.orgInvitationGetQuery, { invitationCode: args.invitationCode })
  if (!invitationResult.success) {
    return invitationResult
  }
  const invitation = invitationResult.data
  if (!invitation) {
    return createResultError(op, "!invitation")
  }

  const now = nowIso()
  const update: Partial<OrgInvitationDataModel> = {
    emailSendAt: now,
    emailSendAmount: invitation.emailSendAmount + 1,
  }
  const update2 = {
    _id: invitation._id,
    ...update,
  } as const

  const updateResult = await ctx.runMutation(internal.org.orgInvitationUpdateMutation, update2)

  return createResult(null)
}
