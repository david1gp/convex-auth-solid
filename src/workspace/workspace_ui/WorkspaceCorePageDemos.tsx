import { Show } from "solid-js"
import { WorkspaceInvitationPageDemos } from "#src/workspace/invitation_ui/demo/WorkspaceInvitationPageDemos.tsx"
import { WorkspaceMemberPageDemos } from "#src/workspace/member_ui/demo/WorkspaceMemberPageDemos.tsx"
import { WorkspaceForm } from "#src/workspace/workspace_ui/form/WorkspaceForm.tsx"
import { WorkspaceListView } from "#src/workspace/workspace_ui/list/WorkspaceListView.tsx"
import { WorkspaceAdd } from "#src/workspace/workspace_ui/mutate/WorkspaceAdd.tsx"
import { WorkspaceView } from "#src/workspace/workspace_ui/view/WorkspaceView.tsx"
import { workspaceCoreAddDemoStateCreate } from "#src/workspace/workspace_ui/workspaceCoreAddDemoStateCreate.ts"
import { workspaceCoreDemoStateCreate } from "#src/workspace/workspace_ui/workspaceCoreDemoStateCreate.ts"
import { workspaceCoreMutateDemoStateCreate } from "#src/workspace/workspace_ui/workspaceCoreMutateDemoStateCreate.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"

function WorkspaceListDemo() {
  const state = workspaceCoreDemoStateCreate()
  return <WorkspaceListView state={state.listState} addHref={state.addHref} viewHref={state.viewHref} />
}

function WorkspaceAddDemo() {
  const state = workspaceCoreAddDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.listHref}>All workspaces</LinkButtonInternal>
      <WorkspaceAdd sm={state.form} />
      <Show when={state.createdHandle()}>
        {(handle) => (
          <p role="status">
            Workspace created in this demo.{" "}
            <LinkButtonInternal to={state.viewHref(handle())}>View {handle()}</LinkButtonInternal>
          </p>
        )}
      </Show>
    </>
  )
}

function WorkspaceViewDemo() {
  const state = workspaceCoreDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.listHref}>All workspaces</LinkButtonInternal>
      <Show when={state.workspace()} fallback={<p>Workspace not found in this demo. Create one from the list.</p>}>
        {(workspace) => (
          <>
            <WorkspaceView workspace={workspace()} editHref={state.editHref(workspace().workspaceHandle)} />
            <nav class="flex gap-4">
              <LinkButtonInternal to={state.membersHref(workspace().workspaceHandle)}>Members</LinkButtonInternal>
              <LinkButtonInternal to={state.invitationsHref(workspace().workspaceHandle)}>
                Invitations
              </LinkButtonInternal>
            </nav>
          </>
        )}
      </Show>
    </>
  )
}

function WorkspaceEditDemo() {
  const state = workspaceCoreMutateDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.viewHref(state.selectedWorkspace?.workspaceHandle ?? "sample-workspace")}>
        Workspace
      </LinkButtonInternal>
      <Show when={state.workspace() && state.editForm} fallback={<p>Workspace not found in this demo.</p>}>
        <WorkspaceForm
          demo
          mode={formMode.edit}
          workspaceHandle={state.selectedWorkspace?.workspaceHandle}
          sm={state.editForm!}
          removeHref={state.removeHref(state.selectedWorkspace!.workspaceHandle)}
        />
        <p role="status">Changes to this workspace are kept locally in the demo.</p>
      </Show>
    </>
  )
}

function WorkspaceRemoveDemo() {
  const state = workspaceCoreMutateDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.listHref}>All workspaces</LinkButtonInternal>
      <Show when={state.workspace() && state.removeForm} fallback={<p>Workspace removed or not found in this demo.</p>}>
        <WorkspaceForm
          demo
          mode={formMode.remove}
          workspaceHandle={state.selectedWorkspace?.workspaceHandle}
          sm={state.removeForm!}
        />
      </Show>
    </>
  )
}

/** Opt-in map for the gallery integrator; do not mount the live workspace routes. */
export const WorkspaceCorePageDemos = {
  "/w/list": WorkspaceListDemo,
  "/w/add": WorkspaceAddDemo,
  "/w/:workspaceHandle/view": WorkspaceViewDemo,
  "/w/:workspaceHandle/edit": WorkspaceEditDemo,
  "/w/:workspaceHandle/remove": WorkspaceRemoveDemo,
  ...WorkspaceMemberPageDemos,
  ...WorkspaceInvitationPageDemos,
} as const
