import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavOrg } from "#src/app/nav/NavOrg.jsx"
import { OrgForm } from "#src/org/org_ui/form/OrgForm.jsx"
import { orgFormStateManagement } from "#src/org/org_ui/form/orgFormStateManagement.js"
import { urlOrgAdd } from "#src/org/org_url/urlOrg.js"
import { formMode } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

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
  return ttc("Create new Organization")
}

export interface OrgAddProps extends MayHaveClass {}

export function OrgAdd(p: OrgAddProps) {
  const sm = orgFormStateManagement(formMode.add)
  return <OrgForm mode={formMode.add} sm={sm} class={p.class} />
}
