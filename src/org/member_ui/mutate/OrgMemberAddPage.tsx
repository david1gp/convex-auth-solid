import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { OrgMemberForm } from "#src/org/member_ui/form/OrgMemberForm.tsx"
import { orgMemberFormStateManagement } from "#src/org/member_ui/form/orgMemberFormStateManagement.ts"
import { urlOrgMemberAdd } from "#src/org/member_url/urlOrgMember.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

export function OrgMemberAddPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttc("Missing :memberId in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            <NavLinkButton href={urlOrgMemberAdd(getOrgHandle()!)} isActive={true}>
              {ttc("Add Member")}
            </NavLinkButton>
          </NavOrg>
          <OrgMemberAdd orgHandle={getOrgHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string) {
  return ttc("Add new Organization Member")
}

export interface OrgMemberAddProps extends HasOrgHandle, MayHaveClass {}

export function OrgMemberAdd(p: OrgMemberAddProps) {
  const sm = orgMemberFormStateManagement(formMode.add, p.orgHandle)
  return <OrgMemberForm mode={formMode.add} sm={sm} class={p.class} />
}
