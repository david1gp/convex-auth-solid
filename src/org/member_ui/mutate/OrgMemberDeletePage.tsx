import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { OrgMemberMutate } from "@/org/member_ui/mutate/OrgMemberMutate"
import { urlOrgMemberRemove } from "@/org/member_url/urlOrgMember"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode, getFormModeTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

const mode = formMode.remove

export function OrgMemberDeletePage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  const getMemberId = () => params.memberId
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={!getMemberId()}>
        <ErrorPage title={ttc("Missing :memberId in path")} />
      </Match>
      <Match when={getMemberId()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            <NavLinkButton href={urlOrgMemberRemove(getOrgHandle()!, getMemberId()!)} isActive={true}>
              {ttc("Remove Member")}
            </NavLinkButton>
          </NavOrg>
          <OrgMemberMutate mode={mode} orgHandle={getOrgHandle()!} memberId={getMemberId()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormModeTitle(mode, ttc("Organization Member"))
}
