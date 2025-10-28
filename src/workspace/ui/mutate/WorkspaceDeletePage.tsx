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
  const getSlug = () => params.slug
  return (
    <Switch>
      <Match when={!getSlug()}>
        <ErrorPage title={ttt("Missing :slug in path")} />
      </Match>
      <Match when={getSlug()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} workspaceSlug={getSlug()} />
          <WorkspaceMutate mode={mode} workspaceSlug={getSlug()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormTitle(mode, workspaceName ?? ttt("Workspace"))
}
