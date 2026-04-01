export const workspaceMemberFormField = {
  role: "role",
} as const

export type WorkspaceMemberFormField = (typeof workspaceMemberFormField)[keyof typeof workspaceMemberFormField]
