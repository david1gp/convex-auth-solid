import { ttc } from "#src/app/i18n/ttc.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { mdiAccountQuestion, mdiCheck, mdiClose, mdiClockOutline } from "@mdi/js"

export type WorkspaceInvitationStatus = keyof typeof workspaceInvitationStatus

export const workspaceInvitationStatus = {
  pending: "pending",
  accepted: "accepted",
  dismissed: "dismissed",
  expired: "expired",
} as const

export const workspaceInvitationStatusText = {
  pending: ttc("Pending"),
  accepted: ttc("Accepted"),
  dismissed: ttc("Dismissed"),
  expired: ttc("Expired"),
} as const

export const workspaceInvitationStatusIcon = {
  pending: mdiClockOutline,
  accepted: mdiCheck,
  dismissed: mdiClose,
  expired: mdiAccountQuestion,
} as const

export const workspaceInvitationStatusClasses = {
  pending: "text-yellow-600",
  accepted: "text-green-600",
  dismissed: "text-red-600",
  expired: "text-gray-600",
} as const

export function invitationModelToStatus(i: WorkspaceInvitationModel): WorkspaceInvitationStatus {
  if (i.status === "accepted") return workspaceInvitationStatus.accepted
  if (i.status === "dismissed") return workspaceInvitationStatus.dismissed
  if (i.expiresAt && new Date(i.expiresAt) < new Date()) return workspaceInvitationStatus.expired
  return workspaceInvitationStatus.pending
}
