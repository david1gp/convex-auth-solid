import { useParams } from "@tanstack/solid-router"
import { Match, Show, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavWorkspace } from "#src/app/nav/NavWorkspace.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import { workspaceMemberSchema } from "#src/workspace/member_model/WorkspaceMemberSchema.ts"
import { WorkspaceMemberListView } from "#src/workspace/member_ui/list/WorkspaceMemberListView.tsx"
import {
  urlWorkspaceMemberAdd,
  urlWorkspaceMemberEdit,
  urlWorkspaceMemberList,
} from "#src/workspace/member_url/urlWorkspaceMember.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

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
          <NavWorkspace
            getWorkspacePageTitle={(name) => `${name ?? ttc("Workspace")} ${ttc("Members")}`}
            workspaceHandle={getWorkspaceHandle()}
          >
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

function WorkspaceMemberListLoader(p: { workspaceHandle: string }) {
  const pagination = cursorPaginationCreate({
    query: api.workspace.workspaceMemberListQuery,
    queryKey: "workspaceMemberListQuery",
    args: () => ({ token: userTokenGet(), workspaceHandle: p.workspaceHandle }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    scope: () => p.workspaceHandle,
    itemSchema: workspaceMemberSchema,
  })
  return (
    <Show when={pagination.page()?.success !== false} fallback={<p>Fallback content</p>}>
      <WorkspaceMemberListView
        members={() => {
          const result = pagination.page()
          return result?.success ? result.data.page : undefined
        }}
        addHref={urlWorkspaceMemberAdd(p.workspaceHandle)}
        editHref={(memberId) => urlWorkspaceMemberEdit(p.workspaceHandle, memberId)}
        page={() => pagination.history().length + 1}
        canPrevious={pagination.canPrevious}
        canNext={pagination.canNext}
        previous={pagination.previous}
        next={pagination.next}
        loading={pagination.loading}
      />
    </Show>
  )
}
