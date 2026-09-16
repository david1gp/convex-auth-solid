import { mdiAccountMultiple } from "@adaptive-ds/mdi/mdiAccountMultiple.js"
import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { useParams } from "@tanstack/solid-router"
import { For, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { workspaceMemberSchema } from "#src/workspace/member_model/WorkspaceMemberSchema.ts"
import {
  urlWorkspaceMemberAdd,
  urlWorkspaceMemberEdit,
  urlWorkspaceMemberList,
} from "#src/workspace/member_url/urlWorkspaceMember.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

export function WorkspaceMemberListPage() {
  const params = useParams({ strict: false })
  const getWorkspaceHandle = () => params().workspaceHandle
  return (
    <Switch>
      <Match when={!getWorkspaceHandle()}>
        <ErrorPage title={ttc("Missing :workspaceHandle in path")} />
      </Match>
      <Match when={getWorkspaceHandle()}>
        <PageWrapper>
          <NavWorkspace getWorkspacePageTitle={getPageTitle} workspaceHandle={getWorkspaceHandle()}>
            <NavLinkButton href={urlWorkspaceMemberList(getWorkspaceHandle()!)} isActive={true}>
              {ttc("Members")}
            </NavLinkButton>
          </NavWorkspace>
          <WorkspaceMemberListLoader workspaceHandle={getWorkspaceHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(workspaceName?: string) {
  const name = workspaceName ?? ttc("Workspace")
  return `${name} ${ttc("Members")}`
}

type WorkspaceMember = WorkspaceMemberModel

interface WorkspaceMemberListLoaderProps extends HasWorkspaceHandle {}

function WorkspaceMemberListLoader(p: WorkspaceMemberListLoaderProps) {
  const pagination = cursorPaginationCreate({
    query: api.workspace.workspaceMemberListQuery,
    queryKey: "workspaceMemberListQuery",
    args: () => ({ token: userTokenGet(), workspaceHandle: p.workspaceHandle }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    scope: () => p.workspaceHandle,
    itemSchema: workspaceMemberSchema,
  })

  return (
    <>
      <PageHeader
        icon={mdiAccountMultiple}
        title={ttc("Workspace Members")}
        subtitle={ttc("Manage members of this workspace")}
        class="mb-4"
      >
        <WorkspaceMemberCreateLink workspaceHandle={p.workspaceHandle} />
      </PageHeader>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={pagination.page() === undefined}>
          <WorkspaceMemberLoading />
        </Match>
        <Match when={resultHasNoWorkspaceMembers(pagination.page())}>
          <NoWorkspaceMembers />
        </Match>
        <Match when={getWorkspaceMembersPage(pagination.page())}>
          {(getPage) => (
            <WorkspaceMemberList workspaceHandle={p.workspaceHandle} members={getPage().page} pagination={pagination} />
          )}
        </Match>
      </Switch>
    </>
  )
}

export function NoWorkspaceMembers(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Members")} class={p.class}>
      {p.children}
    </NoData>
  )
}

interface WorkspaceMemberListProps extends HasWorkspaceHandle {
  members: WorkspaceMember[]
  pagination: ReturnType<typeof cursorPaginationCreate<typeof api.workspace.workspaceMemberListQuery, WorkspaceMember>>
}

function WorkspaceMemberList(p: WorkspaceMemberListProps) {
  return (
    <>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={p.members}>
          {(member) => <WorkspaceMemberLink workspaceHandle={p.workspaceHandle} member={member} />}
        </For>
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

function getWorkspaceMembersPage(
  workspaceMembersResult: Result<PaginationResultType<WorkspaceMember>> | undefined,
): PaginationResultType<WorkspaceMember> | null {
  if (!workspaceMembersResult?.success) return null
  return workspaceMembersResult.data
}

function resultHasNoWorkspaceMembers(
  workspaceMembersResult: Result<PaginationResultType<WorkspaceMember>> | undefined,
): boolean {
  const page = getWorkspaceMembersPage(workspaceMembersResult)
  return page !== null && page.page.length <= 0
}

function WorkspaceMemberLoading() {
  return <LoadingSection loadingSubject={ttc("Workspace Members")} />
}

interface WorkspaceMemberLinkProps extends HasWorkspaceHandle {
  member: WorkspaceMember
}

function WorkspaceMemberLink(p: WorkspaceMemberLinkProps) {
  return (
    <LinkButtonInternal to={urlWorkspaceMemberEdit(p.workspaceHandle, p.member.memberId)}>
      {p.member.userId}
    </LinkButtonInternal>
  )
}

function WorkspaceMemberCreateLink(p: HasWorkspaceHandle) {
  return (
    <LinkButtonInternal
      icon={mdiPlus}
      to={urlWorkspaceMemberAdd(p.workspaceHandle)}
      variant={buttonVariant.filledGreen}
    >
      {ttc("Add Member")}
    </LinkButtonInternal>
  )
}
