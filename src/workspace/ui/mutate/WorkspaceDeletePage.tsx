import { NavAppDir } from "@/app/nav/NavAppDir"
import { WorkspaceMutate } from "@/workspace/ui/mutate/WorkspaceMutate"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"

const mode = formMode.remove

export function WorkspaceDeletePage() {
  const params = useParams()
  const getHandle = () => params.handle
  return (
    <Switch>
      <Match when={!getHandle()}>
        <ErrorPage title={ttt("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={getHandle()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} workspaceHandle={getHandle()} />
          <WorkspaceMutate mode={mode} workspaceHandle={getHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormTitle(mode, workspaceName ?? ttt("Workspace"))
}
