import { ttc } from "#src/app/i18n/ttc.js"
import { orgRole, type OrgRole } from "#src/org/org_model_field/orgRole.js"

export function orgRoleGetText(r: string) {
  switch (r as OrgRole) {
    case orgRole.member:
      return ttc("Member")
    case orgRole.guest:
      return ttc("Guest")
  }
}
