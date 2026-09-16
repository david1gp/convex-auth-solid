import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { createEffect, For, Match, Switch } from "solid-js"
import type * as a from "valibot"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { LinkLikeText } from "#src/ui/links/LinkLikeText.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import type { WorkspaceModel } from "#src/workspace/workspace_model/WorkspaceModel.ts"
import { workspaceSchema } from "#src/workspace/workspace_model/workspaceSchema.ts"
import { workspaceListSignalAdd } from "#src/workspace/workspace_ui/list/workspaceListSignal.ts"
import { urlWorkspaceAdd, urlWorkspaceView } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

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

function getPageTitle(_orgName?: string, _workspaceName?: string) {
  return ttt("Workspaces")
}

type Workspace = a.InferOutput<typeof workspaceSchema>

function WorkspaceListLoader() {
  const pagination = cursorPaginationCreate({
    query: api.workspace.workspacesListQuery,
    queryKey: "workspacesListQuery",
    args: () => ({ token: userTokenGet() }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    itemSchema: workspaceSchema,
  })
  createEffect(() => {
    const workspacesResult = pagination.page()
    if (!workspacesResult) return
    if (!workspacesResult.success) return
    for (const workspace of workspacesResult.data.page as WorkspaceModel[]) {
      workspaceListSignalAdd(workspace)
    }
  })

  return (
    <>
      <PageHeader title={ttt("Workspaces")} subtitle={ttt("Manage different Initiatives, isolated from each other")}>
        <WorkspaceCreateLink />
      </PageHeader>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={pagination.page() === undefined}>
          <WorkspacesLoading />
        </Match>
        <Match when={resultHasNoWorkspaces(pagination.page())}>
          <NoWorkspaces />
        </Match>
        <Match when={getWorkspacesPage(pagination.page())}>
          {(getPage) => <WorkspaceList workspaces={getPage().page} pagination={pagination} />}
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

interface WorkspaceListProps {
  workspaces: Workspace[]
  pagination: ReturnType<typeof cursorPaginationCreate<typeof api.workspace.workspacesListQuery, Workspace>>
}

function WorkspaceList(p: WorkspaceListProps) {
  return (
    <>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={p.workspaces}>{(w) => <WorkspaceLink workspace={w} />}</For>
      </div>
      <PaginationControls
        page={() => p.pagination.history().length + 1}
        canPrevious={p.pagination.canPrevious}
        canNext={p.pagination.canNext}
        previous={p.pagination.previous}
        next={p.pagination.next}
        loading={p.pagination.loading}
      />
    </>
  )
}

function getWorkspacesPage(
  workspacesResult: Result<PaginationResultType<Workspace>> | undefined,
): PaginationResultType<Workspace> | null {
  if (!workspacesResult?.success) return null
  return workspacesResult.data
}

function resultHasNoWorkspaces(workspacesResult: Result<PaginationResultType<Workspace>> | undefined): boolean {
  const page = getWorkspacesPage(workspacesResult)
  return page !== null && page.page.length <= 0
}

function WorkspaceLink(p: { workspace: Workspace }) {
  return <LinkButtonInternal to={urlWorkspaceView(p.workspace.workspaceHandle)}>{p.workspace.name}</LinkButtonInternal>
}

function WorkspaceCreateLink() {
  return (
    <LinkButtonInternal icon={mdiPlus} to={urlWorkspaceAdd()} variant={buttonVariant.filledGreen}>
      {"Create Workspace"}
    </LinkButtonInternal>
  )
}
