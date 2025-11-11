import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { mdiAccountQuestion, mdiCheck, mdiEmailSync } from "@mdi/js"
import { ttt } from "~ui/i18n/ttt"

export type OrgInvitationStatus = keyof typeof orgInvitationStatus

export const orgInvitationStatus = {
  sendingEmail: "sendingEmail",
  waitingForConfirmation: "waitingForConfirmation",
  accepted: "accepted",
} as const

export const orgInvitationStatusText = {
  sendingEmail: ttt("Sending Invitation Email..."),
  waitingForConfirmation: ttt("Waiting for manual confirmation"),
  accepted: ttt("Invitation accepted"),
} as const

export const orgInvitationStatusIcon = {
  sendingEmail: mdiEmailSync,
  waitingForConfirmation: mdiAccountQuestion,
  accepted: mdiCheck,
} as const

export const orgInvitationStatusClasses = {
  sendingEmail: "text-yellow-600",
  waitingForConfirmation: "text-yellow-600",
  accepted: "text-green-600",
} as const

export function invitationModelToStatus(i: OrgInvitationModel): OrgInvitationStatus {
  if (i.acceptedAt) return orgInvitationStatus.accepted
  if (i.emailSendAt) return orgInvitationStatus.waitingForConfirmation
  return orgInvitationStatus.sendingEmail
}
