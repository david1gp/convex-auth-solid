import { ttc } from "@/app/i18n/ttc"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { mdiAccountQuestion, mdiEmailSync } from "@mdi/js"

export type OrgInvitationStatus = keyof typeof orgInvitationStatus

export const orgInvitationStatus = {
  sendingEmail: "sendingEmail",
  waitingForConfirmation: "waitingForConfirmation",
} as const

export const orgInvitationStatusText = {
  sendingEmail: ttc("Sending Invitation Email..."),
  waitingForConfirmation: ttc("Waiting for manual confirmation"),
} as const

export const orgInvitationStatusIcon = {
  sendingEmail: mdiEmailSync,
  waitingForConfirmation: mdiAccountQuestion,
} as const

export const orgInvitationStatusClasses = {
  sendingEmail: "text-yellow-600",
  waitingForConfirmation: "text-yellow-600",
} as const

export function invitationModelToStatus(i: OrgInvitationModel): OrgInvitationStatus {
  if (i.emailSendAt) return orgInvitationStatus.waitingForConfirmation
  return orgInvitationStatus.sendingEmail
}
