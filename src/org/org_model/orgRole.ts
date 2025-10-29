export type OrgRole = keyof typeof orgRole
import * as v from "valibot"

export const orgRole = {
  member: "member",
  guest: "guest",
} as const

export const orgRoleSchema = v.enum(orgRole)
