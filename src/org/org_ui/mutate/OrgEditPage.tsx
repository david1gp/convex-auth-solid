import { NavOrg } from "@/app/nav/NavOrg"
import { OrgMemberListPage } from "@/org/member_ui/list/OrgMemberListPage"
import { OrgMutate } from "@/org/org_ui/mutate/OrgMutate"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormModeTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

const mode = formMode.edit

export function OrgEditPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            <LinkLikeText>{ttt("Edit")}</LinkLikeText>
          </NavOrg>
          <OrgMutate mode={mode} orgHandle={getOrgHandle()!} />
        </PageWrapper>
        <OrgMemberListPage />
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormModeTitle(mode, workspaceName ?? ttt("Organization"))
}
