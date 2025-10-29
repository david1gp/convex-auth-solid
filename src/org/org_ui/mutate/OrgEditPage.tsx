import { NavAppDir } from "@/app/nav/NavAppDir"
import { OrgMemberListPage } from "@/org/members_ui/list/OrgMemberListPage"
import { OrgMutate } from "@/org/org_ui/mutate/OrgMutate"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"

const mode = formMode.edit

export function OrgEditPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  const getReturnPath = () => params.returnPath
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} orgHandle={getOrgHandle()} />
          <OrgMutate mode={mode} orgHandle={getOrgHandle()!} returnPath={getReturnPath()} />
        </PageWrapper>
        <OrgMemberListPage />
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormTitle(mode, workspaceName ?? ttt("Organization"))
}
