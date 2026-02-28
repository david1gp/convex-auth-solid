export const orgMemberFormField = {
  role: "role",
} as const

export type OrgMemberFormField = (typeof orgMemberFormField)[keyof typeof orgMemberFormField]
