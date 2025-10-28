import { NavAppDir } from "@/app/nav/NavAppDir"
import type { HasWorkspaceSlug } from "@/workspace/model/HasWorkspaceSlug"
import { workspaceListFindNameBySlug } from "@/workspace/ui/list/workspaceListSignal"
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
  const getWorkspaceSlug = () => params.slug
  return (
    <Switch>
      <Match when={!getWorkspaceSlug()}>
        <ErrorPage title={ttt("Missing :slug in path")} />
      </Match>
      <Match when={getWorkspaceSlug()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} workspaceSlug={getWorkspaceSlug()} />
          <WorkspaceView workspaceSlug={getWorkspaceSlug()!} />
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

interface WorkspaceViewProps extends HasWorkspaceSlug, MayHaveClass {}

function WorkspaceView(p: WorkspaceViewProps) {
  return (
    <div class="flex flex-wrap items-center gap-4">
      <Show when={p.workspaceSlug && workspaceListFindNameBySlug(p.workspaceSlug)}>
        <h1 class="text-2xl font-bold">{workspaceListFindNameBySlug(p.workspaceSlug)}</h1>
      </Show>
      <LinkButton href={urlWorkspaceEdit(p.workspaceSlug)} variant={buttonVariant.default} icon={formIcon.edit}>
        {ttt("Edit")}
      </LinkButton>
    </div>
  )
}
