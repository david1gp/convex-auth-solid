import { NavWorkspace } from "@/app/nav/NavWorkspace"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import type { HasWorkspaceHandle } from "@/workspace/model/HasWorkspaceHandle"
import { workspaceListFindNameByHandle } from "@/workspace/ui/list/workspaceListSignal"
import { urlWorkspaceEdit } from "@/workspace/url/urlWorkspace"
import { useParams } from "@solidjs/router"
import { Match, Show, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formIcon } from "~ui/input/form/getFormIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function WorkspaceViewPage() {
  const params = useParams()
  const getWorkspaceHandle = () => params.workspaceHandle
  return (
    <Switch>
      <Match when={!getWorkspaceHandle()}>
        <ErrorPage title={ttt("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={getWorkspaceHandle()}>
        <PageWrapper>
          <NavWorkspace getWorkspacePageTitle={getPageTitle} workspaceHandle={getWorkspaceHandle()}>
            <LinkLikeText>{ttt("View")}</LinkLikeText>
          </NavWorkspace>
          <WorkspaceView workspaceHandle={getWorkspaceHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  let title = "Workspace"
  if (workspaceName) {
    title += " " + workspaceName
  }
  return title
}

interface WorkspaceViewProps extends HasWorkspaceHandle, MayHaveClass {}

function WorkspaceView(p: WorkspaceViewProps) {
  return (
    <div class="flex flex-wrap items-center justify-between gap-4">
      <Show when={p.workspaceHandle && workspaceListFindNameByHandle(p.workspaceHandle)}>
        <h1 class="text-2xl font-bold">{workspaceListFindNameByHandle(p.workspaceHandle)}</h1>
      </Show>
      <LinkButton href={urlWorkspaceEdit(p.workspaceHandle)} variant={buttonVariant.default} icon={formIcon.edit}>
        {ttt("Edit")}
      </LinkButton>
    </div>
  )
}
