import { Show } from "solid-js"
import { workspaceMemberDemoMutateStateCreate } from "#src/workspace/member_ui/demo/workspaceMemberDemoMutateStateCreate.ts"
import { workspaceMemberDemoStateCreate } from "#src/workspace/member_ui/demo/workspaceMemberDemoStateCreate.ts"
import { WorkspaceMemberForm } from "#src/workspace/member_ui/form/WorkspaceMemberForm.tsx"
import { WorkspaceMemberListView } from "#src/workspace/member_ui/list/WorkspaceMemberListView.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"

function WorkspaceMemberListDemo() {
  const state = workspaceMemberDemoStateCreate()
  return (
    <WorkspaceMemberListView
      members={state.members}
      addHref={state.addHref()}
      editHref={state.editHref}
      page={() => 1}
      canPrevious={() => false}
      canNext={() => false}
      previous={() => {}}
      next={() => {}}
      loading={() => false}
    />
  )
}

function WorkspaceMemberAddDemo() {
  const state = workspaceMemberDemoStateCreate()
  return (
    <>
      <LinkButtonInternal to={state.listHref()}>All members</LinkButtonInternal>
      <label for="demo-member-user">Demo user ID</label>
      <input
        id="demo-member-user"
        value={state.form.state.userId.get()}
        onInput={(event) => state.form.state.userId.set(event.currentTarget.value)}
      />
      <WorkspaceMemberForm demo mode={formMode.add} sm={state.form} />
      <Show when={state.form.errors.userId.get()}>
        <p role="alert">{state.form.errors.userId.get()}</p>
      </Show>
      <Show when={state.createdId()}>
        {(id) => (
          <p role="status">
            Member added locally. <LinkButtonInternal to={state.editHref(id())}>Edit member</LinkButtonInternal>
          </p>
        )}
      </Show>
    </>
  )
}

function WorkspaceMemberEditDemo() {
  const state = workspaceMemberDemoMutateStateCreate(formMode.edit)
  return (
    <>
      <LinkButtonInternal to={state.listHref()}>All members</LinkButtonInternal>
      <Show when={state.member()} fallback={<p>Member not found in this demo. Return to the list.</p>}>
        {(member) => (
          <>
            <p>Editing {member().userId}</p>
            <WorkspaceMemberForm demo mode={formMode.edit} sm={state.form} />
            <LinkButtonInternal to={state.deleteHref()}>Remove member</LinkButtonInternal>
            <Show when={state.saved()}>
              <p role="status">Member updated locally in this demo.</p>
            </Show>
          </>
        )}
      </Show>
    </>
  )
}

function WorkspaceMemberDeleteDemo() {
  const state = workspaceMemberDemoMutateStateCreate(formMode.remove)
  return (
    <>
      <Show when={state.member()} fallback={<p>Member removed or not found in this demo.</p>}>
        {(member) => (
          <>
            <LinkButtonInternal to={state.editHref()}>Cancel — edit member</LinkButtonInternal>
            <p>Removing {member().userId}</p>
            <WorkspaceMemberForm demo mode={formMode.remove} sm={state.form} />
          </>
        )}
      </Show>
      <Show when={state.saved()}>
        <p role="status">Member removed locally in this demo.</p>
      </Show>
      <LinkButtonInternal to={state.listHref()}>All members</LinkButtonInternal>
    </>
  )
}

export const WorkspaceMemberPageDemos = {
  "/workspace/:workspaceHandle/members": WorkspaceMemberListDemo,
  "/workspace/:workspaceHandle/members/add": WorkspaceMemberAddDemo,
  "/workspace/:workspaceHandle/members/:memberId/edit": WorkspaceMemberEditDemo,
  "/workspace/:workspaceHandle/members/:memberId/delete": WorkspaceMemberDeleteDemo,
} as const
