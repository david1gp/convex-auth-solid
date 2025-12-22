import type { OrgRole } from "@/org/org_model_field/orgRole"
import { ttt } from "~ui/i18n/ttt"

export const orgRoleText = {
  member: ttt("Member"),
  guest: ttt("Guest"),
} as const satisfies Record<OrgRole, string>
