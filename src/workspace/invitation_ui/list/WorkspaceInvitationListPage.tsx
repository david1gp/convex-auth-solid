import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import { LinkLikeNavText } from "#src/app/nav/links/LinkLikeNavText.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import type { WorkspaceInvitationsProps } from "#src/workspace/invitation_ui/list/WorkspaceInvitationListSection.tsx"
import { WorkspaceInvitationCard } from "#src/workspace/invitation_ui/view/WorkspaceInvitationCard.tsx"
import { urlWorkspaceInvitationAdd } from "#src/workspace/invitation_url/urlWorkspaceInvitation.ts"
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
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"
import { mdiPlus } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { createEffect, For, Match, Show, splitProps, Switch, type Accessor } from "solid-js"
import * as a from "valibot"

export function WorkspaceInvitationListPage() {
  const params = useParams()
  const getWorkspaceHandle = () => params.workspaceHandle
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
  return name + " " + ttc("Invitations")
}

type FetchWorkspaceInvitations = Accessor<Result<WorkspaceInvitationModel[]> | undefined>

interface WorkspaceInvitationListLoaderProps extends HasWorkspaceHandle {}

function WorkspaceInvitationListLoader(p: WorkspaceInvitationListLoaderProps) {
  const getWorkspaceInvitationsQuery: FetchWorkspaceInvitations = createQuery(api.workspace.workspaceInvitationsListQuery, {
    token: userTokenGet(),
    workspaceHandle: p.workspaceHandle,
  })
  const getWorkspaceInvitationsResult = createQueryCached<WorkspaceInvitationModel[]>(
    getWorkspaceInvitationsQuery,
    "workspaceInvitationsListQuery" + "/" + p.workspaceHandle,
    a.any(),
  )
  createEffect(() => {
    const workspaceInvitationsResult = getWorkspaceInvitationsResult()
    if (!workspaceInvitationsResult) return
    if (!workspaceInvitationsResult.success) return
  })

  return (
    <>
      <PageHeader
        title={ttc("Workspace Invitations")}
        subtitle={ttc("Manage invitations of this workspace")}
        class="mb-4"
      >
        <LinkButton icon={mdiPlus} href={urlWorkspaceInvitationAdd(p.workspaceHandle)} variant={buttonVariant.filledGreen}>
          {ttc("Add Invitation")}
        </LinkButton>
      </PageHeader>
      <Switch fallback={<p>Fallback content</p>}>
        <Match when={getWorkspaceInvitationsResult() === undefined}>
          <WorkspaceInvitationLoading />
        </Match>
        <Match when={!hasWorkspaceInvitations(getWorkspaceInvitationsResult())}>
          <NoWorkspaceInvitationsSection />
        </Match>
        <Match when={getData(getWorkspaceInvitationsResult)}>
          {(gotData) => <WorkspaceInvitationList workspaceHandle={p.workspaceHandle} {...gotData()} />}
        </Match>
      </Switch>
    </>
  )
}

function getData(
  workspaceInvitationsResult: () => Result<WorkspaceInvitationModel[]> | undefined,
): { invitations: WorkspaceInvitationModel[] } | null {
  const result = workspaceInvitationsResult()
  if (!result || !result.success) return null
  return { invitations: result.data }
}

function hasWorkspaceInvitations(
  workspaceInvitationsResult: Result<WorkspaceInvitationModel[]> | undefined,
): WorkspaceInvitationModel[] | null {
  if (!workspaceInvitationsResult) return null
  if (!workspaceInvitationsResult.success) return null
  const workspaceInvitations = workspaceInvitationsResult.data
  if (workspaceInvitations.length <= 0) return null
  return workspaceInvitations
}

function WorkspaceInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Workspace Invitations")} />
}

function WorkspaceInvitationList(p: WorkspaceInvitationsProps) {
  const [s, rest] = splitProps(p, ["class"])
  return (
    <Show when={p.invitations.length > 0} fallback={<NoWorkspaceInvitationsSection />}>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={p.invitations}>{(invitation) => <WorkspaceInvitationCard {...rest} invitation={invitation} />}</For>
      </div>
    </Show>
  )
}

export function NoWorkspaceInvitationsSection(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Workspace Invitations")} class={p.class}>
      {p.children}
    </NoData>
  )
}
