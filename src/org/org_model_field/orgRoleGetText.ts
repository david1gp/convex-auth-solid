import { ttc } from "@/app/i18n/ttc"
import { orgRole, type OrgRole } from "@/org/org_model_field/orgRole"

export function orgRoleGetText(r: string) {
  switch (r as OrgRole) {
    case orgRole.member:
      return ttc("Member")
    case orgRole.guest:
      return ttc("Guest")
  }
}
