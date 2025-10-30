export type OrgPageSection = keyof typeof orgPageSection

export const orgPageSection = {
  org: "org",
  members: "members",
  invitations: "invitations",
} as const
