import { NavAppDir } from "@/app/nav/NavAppDir"
import { OrgMutate } from "@/org/ui/mutate/OrgMutate"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"

const mode = formMode.edit

export function OrgEditPage() {
  const params = useParams()
  const getHandle = () => params.handle
  const getReturnPath = () => params.returnPath
  return (
    <Switch>
      <Match when={!getHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={getHandle()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} orgHandle={getHandle()} />
          <OrgMutate mode={mode} orgHandle={getHandle()!} returnPath={getReturnPath()} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormTitle(mode, workspaceName ?? ttt("Organization"))
}
