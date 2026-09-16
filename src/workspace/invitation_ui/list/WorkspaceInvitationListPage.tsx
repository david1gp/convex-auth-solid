import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { useParams } from "@tanstack/solid-router"
import { For, Match, Show, Switch, splitProps } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import { LinkLikeNavText } from "#src/app/nav/links/LinkLikeNavText.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { workspaceInvitationSchema } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import type { WorkspaceInvitationsProps } from "#src/workspace/invitation_ui/list/WorkspaceInvitationListSection.tsx"
import { WorkspaceInvitationCard } from "#src/workspace/invitation_ui/view/WorkspaceInvitationCard.tsx"
import { urlWorkspaceInvitationAdd } from "#src/workspace/invitation_url/urlWorkspaceInvitation.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

export function WorkspaceInvitationListPage() {
  const params = useParams({ strict: false })
  const getWorkspaceHandle = () => params().workspaceHandle
  return (
    <Switch>
      <Match when={!getWorkspaceHandle()}>
        <ErrorPage title={ttc("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={getWorkspaceHandle()}>{(getHandle) => <ListPage workspaceHandle={getHandle()} />}</Match>
    </Switch>
  )
}

interface ListPageProps extends HasWorkspaceHandle, MayHaveClass {}

function ListPage(p: ListPageProps) {
  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <NavWorkspace getWorkspacePageTitle={getPageTitle} workspaceHandle={p.workspaceHandle}>
          <LinkLikeNavText>{ttc("Invitations")}</LinkLikeNavText>
        </NavWorkspace>
        <WorkspaceInvitationListLoader workspaceHandle={p.workspaceHandle} />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

function getPageTitle(workspaceName?: string) {
  const name = workspaceName ?? ttc("Workspace")
  return `${name} ${ttc("Invitations")}`
}

interface WorkspaceInvitationListLoaderProps extends HasWorkspaceHandle {}

function WorkspaceInvitationListLoader(p: WorkspaceInvitationListLoaderProps) {
  const pagination = cursorPaginationCreate({
    query: api.workspace.workspaceInvitationsListQuery,
    queryKey: "workspaceInvitationsListQuery",
    args: () => ({ token: userTokenGet(), workspaceHandle: p.workspaceHandle }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    scope: () => p.workspaceHandle,
    itemSchema: workspaceInvitationSchema,
  })

  return (
    <>
      <PageHeader
        title={ttc("Workspace Invitations")}
        subtitle={ttc("Manage invitations of this workspace")}
        class="mb-4"
      >
        <LinkButtonInternal
          icon={mdiPlus}
          to={urlWorkspaceInvitationAdd(p.workspaceHandle)}
          variant={buttonVariant.filledGreen}
        >
          {ttc("Add Invitation")}
        </LinkButtonInternal>
      </PageHeader>
      <Switch fallback={<p>Fallback content</p>}>
        <Match when={pagination.page() === undefined}>
          <WorkspaceInvitationLoading />
        </Match>
        <Match when={resultHasNoWorkspaceInvitations(pagination.page())}>
          <NoWorkspaceInvitationsSection />
        </Match>
        <Match when={getWorkspaceInvitationsPage(pagination.page())}>
          {(getPage) => (
            <WorkspaceInvitationList
              workspaceHandle={p.workspaceHandle}
              invitations={getPage().page}
              pagination={pagination}
            />
          )}
        </Match>
      </Switch>
    </>
  )
}

function getWorkspaceInvitationsPage(
  workspaceInvitationsResult: Result<PaginationResultType<WorkspaceInvitationModel>> | undefined,
): PaginationResultType<WorkspaceInvitationModel> | null {
  if (!workspaceInvitationsResult?.success) return null
  return workspaceInvitationsResult.data
}

function resultHasNoWorkspaceInvitations(
  workspaceInvitationsResult: Result<PaginationResultType<WorkspaceInvitationModel>> | undefined,
): boolean {
  const page = getWorkspaceInvitationsPage(workspaceInvitationsResult)
  return page !== null && page.page.length <= 0
}

function WorkspaceInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Workspace Invitations")} />
}

interface WorkspaceInvitationListPageProps extends WorkspaceInvitationsProps {
  pagination: ReturnType<
    typeof cursorPaginationCreate<typeof api.workspace.workspaceInvitationsListQuery, WorkspaceInvitationModel>
  >
}

function WorkspaceInvitationList(p: WorkspaceInvitationListPageProps) {
  const [, rest] = splitProps(p, ["class", "pagination"])
  return (
    <>
      <Show when={p.invitations.length > 0} fallback={<NoWorkspaceInvitationsSection />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations}>
            {(invitation) => <WorkspaceInvitationCard {...rest} invitation={invitation} />}
          </For>
        </div>
      </Show>
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

export function NoWorkspaceInvitationsSection(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Workspace Invitations")} class={p.class}>
      {p.children}
    </NoData>
  )
}
