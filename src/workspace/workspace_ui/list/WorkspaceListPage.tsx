import { api } from "#convex/_generated/api.js"
import type { Result, ResultOk } from "#result"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import type { DocWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"
import { workspaceListSignal } from "#src/workspace/workspace_ui/list/workspaceListSignal.ts"
import { urlWorkspaceAdd, urlWorkspaceView } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"
import { mdiPlus } from "@mdi/js"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"

export function WorkspaceListPage() {
  return (
    <PageWrapper>
      <NavWorkspace getWorkspacePageTitle={getPageTitle}>
        <LinkLikeText>{ttt("List")}</LinkLikeText>
      </NavWorkspace>
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
    <>
      <PageHeader title={ttt("Workspaces")} subtitle={ttt("Manage different Initiatives, isolated from each other")}>
        <WorkspaceCreateLink />
      </PageHeader>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={getWorkspacesResult() === undefined}>
          <WorkspacesLoading />
        </Match>
        <Match when={!hasWorkspaces(getWorkspacesResult())}>
          <NoWorkspaces />
        </Match>
        <Match when={true}>
          <WorkspaceList getWorkspaces={getWorkspaces(getWorkspacesResult())} />
        </Match>
      </Switch>
    </>
  )
}

function WorkspacesLoading() {
  return <LoadingSection loadingSubject={ttt("Workspaces")} />
}

export function NoWorkspaces(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttt("No Workspaces")} class={p.class}>
      {p.children}
    </NoData>
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

function WorkspaceLink(p: { workspace: Workspace }) {
  return <LinkButton href={urlWorkspaceView(p.workspace.workspaceHandle)}>{p.workspace.name}</LinkButton>
}

function WorkspaceCreateLink() {
  return (
    <LinkButton icon={mdiPlus} href={urlWorkspaceAdd()} variant={buttonVariant.filledGreen}>
      {"Create Workspace"}
    </LinkButton>
  )
}
