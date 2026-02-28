import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { OrgMemberForm } from "@/org/member_ui/form/OrgMemberForm"
import { orgMemberFormStateManagement } from "@/org/member_ui/form/orgMemberFormStateManagement"
import { urlOrgMemberAdd } from "@/org/member_url/urlOrgMember"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
