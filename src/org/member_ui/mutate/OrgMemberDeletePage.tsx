import { NavOrg } from "@/app/nav/NavOrg"
import { OrgMemberMutate } from "@/org/member_ui/mutate/OrgMemberMutate"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"

const mode = formMode.remove

export function OrgMemberDeletePage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  const getMemberId = () => params.memberId
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={!getMemberId()}>
        <ErrorPage title={ttt("Missing :memberId in path")} />
      </Match>
      <Match when={getMemberId()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            <LinkLikeText>{ttt("Remove Member")}</LinkLikeText>
          </NavOrg>
          <OrgMemberMutate mode={mode} orgHandle={getOrgHandle()!} memberId={getMemberId()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormTitle(mode, ttt("Organization Member"))
}
