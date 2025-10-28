import { NavAppDir } from "@/app/nav/NavAppDir"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { createQuery } from "@/utils/convex/createQuery"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import { workspaceListSignal } from "@/workspace/ui/list/workspaceListSignal"
import { urlWorkspaceAdd, urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { api } from "@convex/_generated/api"
import { mdiPlus } from "@mdi/js"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { Result, ResultOk } from "~utils/result/Result"

export function WorkspaceListPage() {
  return (
    <PageWrapper>
      <NavAppDir getPageTitle={getPageTitle} />
      <WorkspaceListLoader />
    </PageWrapper>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return ttt("Workspaces")
}

type Workspace = DocWorkspace

type FetchWorkspaces = Accessor<Result<Workspace[]> | undefined>

function WorkspaceListLoader(p: {}) {
  // console.log("WorkspaceList.getSession", p.getSession())
  const getWorkspacesResult: FetchWorkspaces = createQuery(api.workspace.workspacesListQuery, {
    token: userTokenGet(),
  })
  createEffect(() => {
    const workspacesResult = getWorkspacesResult()
    if (!workspacesResult) return
    if (!workspacesResult.success) return
    workspaceListSignal.set(workspacesResult.data)
  })

  return (
    <section id="workspaces" class="p-6">
      <div class="flex flex-wrap items-center gap-4">
        <h1 class="text-2xl font-bold">Workspaces</h1>
        <WorkspaceCreateLink />
      </div>

      <p class="text-lg mb-4">Manage different Initiatives, isolated from each other</p>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={getWorkspacesResult() === undefined}>
          <WorkspaceLoading />
        </Match>
        <Match when={!hasWorkspaces(getWorkspacesResult())}>
          <WorkspaceEmpty />
        </Match>
        <Match when={true}>
          <WorkspaceList getWorkspaces={getWorkspaces(getWorkspacesResult())} />
        </Match>
      </Switch>
    </section>
  )
}

function getWorkspaces(workspacesResult: Result<Workspace[]> | undefined): Accessor<Workspace[]> {
  return () => {
    return (workspacesResult as ResultOk<Workspace[]>).data
  }
}

interface WorkspaceListProps {
  getWorkspaces: Accessor<Workspace[]>
}

function WorkspaceList(p: WorkspaceListProps) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={p.getWorkspaces()}>{(w) => <WorkspaceLink workspace={w} />}</For>
    </div>
  )
}

function hasWorkspaces(workspacesResult: Result<Workspace[]> | undefined): Workspace[] | null {
  if (!workspacesResult) return null
  if (!workspacesResult.success) return null
  const workspaces = workspacesResult.data
  if (workspaces.length <= 0) return null
  return workspaces
}

function WorkspaceLoading() {
  return <h2>Loading...</h2>
}

function WorkspaceEmpty() {
  return (
    <div>
      <h2>Empty...</h2>
      <WorkspaceCreateLink />
    </div>
  )
}

function WorkspaceLink(p: { workspace: Workspace }) {
  return <LinkButton href={urlWorkspaceView(p.workspace._id)}>{p.workspace.name}</LinkButton>
}

function WorkspaceCreateLink() {
  return (
    <LinkButton icon={mdiPlus} href={urlWorkspaceAdd()} variant={buttonVariant.success}>
      {"Create Workspace"}
    </LinkButton>
  )
}
