export type OrgRole = keyof typeof orgRole
import * as v from "valibot"
import { ttt } from "~ui/i18n/ttt"

export const orgRole = {
  member: "member",
  guest: "guest",
} as const

export const orgRoleSchema = v.enum(orgRole)

export const orgRoleText = {
  member: ttt("Member"),
  guest: ttt("Guest"),
} as const satisfies Record<OrgRole, string>
