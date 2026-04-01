import { api } from "#convex/_generated/api.js"
import type { Result, ResultOk } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { urlWorkspaceMemberAdd, urlWorkspaceMemberList, urlWorkspaceMemberEdit } from "#src/workspace/member_url/urlWorkspaceMember.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"
import { mdiAccountMultiple, mdiPlus } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import * as a from "valibot"

export function WorkspaceMemberListPage() {
  const params = useParams()
  const getWorkspaceHandle = () => params.workspaceHandle
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
  return name + " " + ttc("Members")
}

type WorkspaceMember = WorkspaceMemberModel

type FetchWorkspaceMembers = Accessor<Result<WorkspaceMember[]> | undefined>

interface WorkspaceMemberListLoaderProps extends HasWorkspaceHandle {}

function WorkspaceMemberListLoader(p: WorkspaceMemberListLoaderProps) {
  const getWorkspaceMembersQuery: FetchWorkspaceMembers = createQuery(api.workspace.workspaceMemberListQuery, {
    token: userTokenGet(),
    workspaceHandle: p.workspaceHandle,
  })
  const getWorkspaceMembersResult = createQueryCached<WorkspaceMember[]>(
    getWorkspaceMembersQuery,
    "workspaceMemberListQuery" + "/" + p.workspaceHandle,
    a.any(),
  )
  createEffect(() => {
    const workspaceMembersResult = getWorkspaceMembersResult()
    if (!workspaceMembersResult) return
    if (!workspaceMembersResult.success) return
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
        <Match when={getWorkspaceMembersResult() === undefined}>
          <WorkspaceMemberLoading />
        </Match>
        <Match when={!hasWorkspaceMembers(getWorkspaceMembersResult())}>
          <NoWorkspaceMembers />
        </Match>
        <Match when={true}>
          <WorkspaceMemberList workspaceHandle={p.workspaceHandle} getWorkspaceMembers={getWorkspaceMembers(getWorkspaceMembersResult())} />
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

function getWorkspaceMembers(workspaceMembersResult: Result<WorkspaceMember[]> | undefined): Accessor<WorkspaceMember[]> {
  return () => {
    return (workspaceMembersResult as ResultOk<WorkspaceMember[]>).data
  }
}

interface WorkspaceMemberListProps extends HasWorkspaceHandle {
  getWorkspaceMembers: Accessor<WorkspaceMember[]>
}

function WorkspaceMemberList(p: WorkspaceMemberListProps) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={p.getWorkspaceMembers()}>{(member) => <WorkspaceMemberLink workspaceHandle={p.workspaceHandle} member={member} />}</For>
    </div>
  )
}

function hasWorkspaceMembers(workspaceMembersResult: Result<WorkspaceMember[]> | undefined): WorkspaceMember[] | null {
  if (!workspaceMembersResult) return null
  if (!workspaceMembersResult.success) return null
  const workspaceMembers = workspaceMembersResult.data
  if (workspaceMembers.length <= 0) return null
  return workspaceMembers
}

function WorkspaceMemberLoading() {
  return <LoadingSection loadingSubject={ttc("Workspace Members")} />
}

interface WorkspaceMemberLinkProps extends HasWorkspaceHandle {
  member: WorkspaceMember
}

function WorkspaceMemberLink(p: WorkspaceMemberLinkProps) {
  return <LinkButton href={urlWorkspaceMemberEdit(p.workspaceHandle, p.member.memberId)}>{p.member.userId}</LinkButton>
}

function WorkspaceMemberCreateLink(p: HasWorkspaceHandle) {
  return (
    <LinkButton icon={mdiPlus} href={urlWorkspaceMemberAdd(p.workspaceHandle)} variant={buttonVariant.filledGreen}>
      {ttc("Add Member")}
    </LinkButton>
  )
}
