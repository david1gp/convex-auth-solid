export type WorkspaceRole = keyof typeof workspaceRole
import * as a from "valibot"

export const workspaceRole = {
  member: "member",
  guest: "guest",
} as const

export const workspaceRoleSchema = a.enum(workspaceRole)
