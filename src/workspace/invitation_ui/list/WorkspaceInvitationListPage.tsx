import { useParams } from "@tanstack/solid-router"
import { Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import { LinkLikeNavText } from "#src/app/nav/links/LinkLikeNavText.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { workspaceInvitationSchema } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { WorkspaceInvitationListHeader } from "#src/workspace/invitation_ui/list/WorkspaceInvitationListHeader.tsx"
import { WorkspaceInvitationListView } from "#src/workspace/invitation_ui/list/WorkspaceInvitationListView.tsx"
import { urlWorkspaceInvitationAdd } from "#src/workspace/invitation_url/urlWorkspaceInvitation.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
      <WorkspaceInvitationListHeader addHref={urlWorkspaceInvitationAdd(p.workspaceHandle)} />
      <Switch fallback={<p>Fallback content</p>}>
        <Match when={pagination.page() === undefined}>
          <WorkspaceInvitationLoading />
        </Match>
        <Match when={getWorkspaceInvitationsPage(pagination.page())}>
          {(getPage) => (
            <WorkspaceInvitationListView
              invitations={() => getPage().page}
              addHref={urlWorkspaceInvitationAdd(p.workspaceHandle)}
              showHeader={false}
              page={() => pagination.history().length + 1}
              canPrevious={pagination.canPrevious}
              canNext={pagination.canNext}
              previous={pagination.previous}
              next={pagination.next}
              loading={pagination.loading}
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

function WorkspaceInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Workspace Invitations")} />
}
