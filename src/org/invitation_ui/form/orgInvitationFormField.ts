export type OrgInvitationFormField = keyof typeof orgInvitationFormField

export const orgInvitationFormField = {
  invitedEmail: "invitedEmail",
  role: "role",
} as const
