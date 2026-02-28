import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { OrgForm } from "@/org/org_ui/form/OrgForm"
import { orgFormStateManagement } from "@/org/org_ui/form/orgFormStateManagement"
import { urlOrgAdd } from "@/org/org_url/urlOrg"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function OrgAddPage() {
  return (
    <PageWrapper>
      <NavOrg getOrgPageTitle={getPageTitle}>
        <NavLinkButton href={urlOrgAdd()} isActive={true}>
          {ttc("Create")}
        </NavLinkButton>
      </NavOrg>
      <OrgAdd />
    </PageWrapper>
  )
}

function getPageTitle(orgName?: string) {
  return ttc("Create new Stakeholder")
}

export interface OrgAddProps extends MayHaveClass {}

export function OrgAdd(p: OrgAddProps) {
  const sm = orgFormStateManagement(formMode.add)
  return <OrgForm mode={formMode.add} sm={sm} class={p.class} />
}
