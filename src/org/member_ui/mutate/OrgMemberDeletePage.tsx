import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavOrg } from "#src/app/nav/NavOrg.js"
import { OrgMemberMutate } from "#src/org/member_ui/mutate/OrgMemberMutate.js"
import { urlOrgMemberRemove } from "#src/org/member_url/urlOrgMember.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { useParams } from "@solidjs/router.js"
import { Match, Switch } from "solid-js"

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
