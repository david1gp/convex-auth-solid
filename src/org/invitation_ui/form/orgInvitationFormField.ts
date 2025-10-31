export type OrgInvitationFormField = keyof typeof orgInvitationFormField

export const orgInvitationFormField = {
  invitedName: "invitedName",
  invitedEmail: "invitedEmail",
  role: "role",
} as const
