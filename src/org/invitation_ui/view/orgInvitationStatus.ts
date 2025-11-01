import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { mdiAccountQuestion, mdiCheck, mdiEmailSync } from "@mdi/js"
import { ttt } from "~ui/i18n/ttt"

export type OrgInvitationStatus = keyof typeof orgInvitationStatus

export const orgInvitationStatus = {
  sendingEmail: "sendingEmail",
  waitingForConfirmation: "waitingForConfirmation",
  accepted: "accepted",
} as const

export const orgInvitationStatusText = {
  sendingEmail: ttt("Sending Email..."),
  waitingForConfirmation: ttt("Email send, waiting for manual confirmation"),
  accepted: ttt("Accepted"),
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

export type OrgInvitationStatusAndTime = {
  status: OrgInvitationStatus
  date?: string
}

export function invitationDocToStatus(i: DocOrgInvitation): OrgInvitationStatusAndTime {
  if (i.acceptedAt) return { status: orgInvitationStatus.accepted, date: i.acceptedAt }
  if (i.emailSendAt) return { status: orgInvitationStatus.waitingForConfirmation, date: i.emailSendAt }
  return { status: orgInvitationStatus.sendingEmail }
}
