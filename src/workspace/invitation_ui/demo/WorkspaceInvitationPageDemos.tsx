import { Show } from "solid-js"
import { WorkspaceInvitationAcceptView } from "#src/workspace/invitation_ui/accept/WorkspaceInvitationAcceptView.tsx"
import { workspaceInvitationDemoStateCreate } from "#src/workspace/invitation_ui/demo/workspaceInvitationDemoStateCreate.ts"
import { WorkspaceInvitationForm } from "#src/workspace/invitation_ui/form/WorkspaceInvitationForm.tsx"
import { WorkspaceInvitationListView } from "#src/workspace/invitation_ui/list/WorkspaceInvitationListView.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"

function WorkspaceInvitationListDemo() {
  const state = workspaceInvitationDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.workspaceHref()}>Workspace</LinkButtonInternal>
      <WorkspaceInvitationListView
        invitations={state.invitations}
        addHref={state.addHref()}
        acceptHref={state.acceptHref}
        onResend={state.resend}
        onDismiss={state.dismiss}
        page={() => 1}
        canPrevious={() => false}
        canNext={() => false}
        previous={() => {}}
        next={() => {}}
        loading={() => false}
      />
      <p role="status">{state.notice()}</p>
    </>
  )
}

function WorkspaceInvitationAddDemo() {
  const state = workspaceInvitationDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.listHref()}>All invitations</LinkButtonInternal>
      <WorkspaceInvitationForm demo mode={formMode.add} sm={state.form} title={`Invite to ${state.handle()}`} />
      <Show when={state.createdCode()}>
        {(code) => (
          <p role="status">
            {state.notice()} <LinkButtonInternal to={state.acceptHref(code())}>Accept invitation</LinkButtonInternal>
          </p>
        )}
      </Show>
    </>
  )
}

function WorkspaceInvitationAcceptDemo() {
  const state = workspaceInvitationDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.listHref()}>All invitations</LinkButtonInternal>
      <Show when={state.invitation() && state.workspace()} fallback={<p>Invitation not found in this demo.</p>}>
        <WorkspaceInvitationAcceptView
          invitation={state.invitation()!}
          workspace={state.workspace()!}
          onAccept={state.accept}
          accepted={state.invitation()?.status === "accepted"}
        />
      </Show>
      <p role="status">{state.notice()}</p>
      <Show when={state.invitation()?.status === "accepted"}>
        <LinkButtonInternal to={state.workspaceHref()}>View workspace</LinkButtonInternal>
      </Show>
    </>
  )
}

export const WorkspaceInvitationPageDemos = {
  "/workspace/:workspaceHandle/invitations": WorkspaceInvitationListDemo,
  "/workspace/:workspaceHandle/invitations/add": WorkspaceInvitationAddDemo,
  "/invite/:invitationCode/accept": WorkspaceInvitationAcceptDemo,
} as const
