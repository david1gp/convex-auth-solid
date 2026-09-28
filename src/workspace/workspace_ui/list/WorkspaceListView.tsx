import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { For, Match, Switch } from "solid-js"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { WorkspaceListViewState } from "#src/workspace/workspace_ui/list/WorkspaceListViewState.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"

export function WorkspaceListView(p: {
  state: WorkspaceListViewState
  addHref: string
  viewHref: (handle: string) => string
}) {
  return (
    <>
      <PageHeader title={ttt("Workspaces")} subtitle={ttt("Manage different Initiatives, isolated from each other")}>
        <LinkButtonInternal icon={mdiPlus} to={p.addHref} variant={buttonVariant.filledGreen}>
          {"Create Workspace"}
        </LinkButtonInternal>
      </PageHeader>
      <Switch fallback={<p>Fallback content</p>}>
        <Match when={p.state.workspaces() === undefined}>
          <LoadingSection loadingSubject={ttt("Workspaces")} />
        </Match>
        <Match when={p.state.workspaces()?.length === 0}>
          <NoData noDataText={ttt("No Workspaces")} />
        </Match>
        <Match when={p.state.workspaces()}>
          {(workspaces) => (
            <>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <For each={workspaces()}>
                  {(workspace) => (
                    <LinkButtonInternal to={p.viewHref(workspace.workspaceHandle)}>{workspace.name}</LinkButtonInternal>
                  )}
                </For>
              </div>
              <PaginationControls
                page={p.state.page}
                canPrevious={p.state.canPrevious}
                canNext={p.state.canNext}
                previous={p.state.previous}
                next={p.state.next}
                loading={p.state.loading}
              />
            </>
          )}
        </Match>
      </Switch>
    </>
  )
}
