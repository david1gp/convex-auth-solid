import { NavWorkspace } from "@/app/nav/NavWorkspace"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { WorkspaceLoader, type WorkspaceComponentProps } from "@/workspace/ui/view/WorkspaceLoader"
import { urlWorkspaceEdit } from "@/workspace/url/urlWorkspace"
import { useParams } from "@solidjs/router"
import { For, Match, Show, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { Img } from "~ui/static/img/Img"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classArr } from "~ui/utils/classArr"

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
          <WorkspaceLoader workspaceHandle={getWorkspaceHandle()!} WorkspaceComponent={WorkspaceView} />
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

function WorkspaceView(p: WorkspaceComponentProps) {
  return (
    <div class="flex flex-col gap-4">
      <ShowImg {...p} />
      <div class="flex flex-wrap justify-between">
        <h1 class="text-2xl font-bold">{p.workspace.name}</h1>
        <LinkButton
          href={urlWorkspaceEdit(p.workspace.workspaceHandle)}
          variant={buttonVariant.default}
          icon={formModeIcon.edit}
        >
          {ttt("Edit")}
        </LinkButton>
      </div>
      <ShowSubtitle {...p} />
      <ShowUrl {...p} />
    </div>
  )
}

function ShowImg(p: WorkspaceComponentProps) {
  return (
    <Show when={p.workspace.image}>
      {(getImageUrl) => (
        <Img
          src={getImageUrl()}
          alt={ttt("Logo of ") + " " + p.workspace.name}
          class={classArr("h-40 rounded-xl mx-auto mb-6")}
        />
      )}
    </Show>
  )
}

function ShowSubtitle(p: WorkspaceComponentProps) {
  return (
    <Show when={p.workspace.subtitle}>
      {(getSubtitle) => (
        <div class="text-lg mx-auto text-pretty mb-4">
          <Subtitle subtitle={getSubtitle()} />
        </div>
      )}
    </Show>
  )
}

function Subtitle(p: { subtitle: string }) {
  const lines = p.subtitle.split("\n")
  return <For each={lines}>{(line) => <p>{line}</p>}</For>
}

function ShowUrl(p: WorkspaceComponentProps) {
  return (
    <Show when={p.workspace.url}>
      {(getUrl) => (
        <a
          href={getUrl()}
          class={classArr(
            "text-lg font-semibold",
            "text-black dark:text-white", // text color
            "underline decoration-2 underline-offset-4",
          )}
        >
          {getUrl()}
        </a>
      )}
    </Show>
  )
}
