import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { WorkspaceMemberForm } from "#src/workspace/member_ui/form/WorkspaceMemberForm.tsx"
import { workspaceMemberFormStateManagement } from "#src/workspace/member_ui/form/workspaceMemberFormStateManagement.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import type { HasWorkspaceMemberId } from "#src/workspace/workspace_model_field/HasWorkspaceMemberId.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { resultHasData } from "#src/utils/result/resultHasData.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { Match, Switch } from "solid-js"

interface WorkspaceMemberMutateProps extends HasWorkspaceHandle, HasWorkspaceMemberId, HasFormModeMutate, MayHaveClass {}

export function WorkspaceMemberMutate(p: WorkspaceMemberMutateProps) {
  const getMember = createQuery(api.workspace.workspaceMemberGetQuery, {
    token: userTokenGet(),
    workspaceHandle: p.workspaceHandle,
    memberId: p.memberId as IdWorkspaceMember,
  })
  const member = (): WorkspaceMemberModel | null => resultHasData(getMember()) as WorkspaceMemberModel | null
  return (
    <Switch>
      <Match when={!getMember()}>
        <LoadingSection loadingSubject={ttc("Workspace Member")} />
      </Match>
      <Match when={resultHasErrorMessage(getMember())}>{(errorMessage) => <ErrorPage title={errorMessage()} />}</Match>
      <Match when={member()}>
        <WorkspaceMemberMutateForm mode={p.mode} workspaceHandle={p.workspaceHandle} memberId={p.memberId} member={member()!} />
      </Match>
    </Switch>
  )
}

interface WorkspaceMemberMutateFormProps extends WorkspaceMemberMutateProps {
  member: WorkspaceMemberModel
}

function WorkspaceMemberMutateForm(p: WorkspaceMemberMutateFormProps) {
  const sm = workspaceMemberFormStateManagement(p.mode, p.workspaceHandle, p.memberId as IdWorkspaceMember, p.member)
  return <WorkspaceMemberForm mode={p.mode} sm={sm} />
}
