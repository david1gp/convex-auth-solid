import { mdiAccountAlert } from "@adaptive-ds/mdi/mdiAccountAlert.js"
import { useParams } from "@tanstack/solid-router"
import { Match, Switch } from "solid-js"
import * as a from "valibot"
import { api } from "#convex/_generated/api.js"
import type { ResultErr, ResultOk } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { mutationCreate } from "#src/utils/convex_client/mutationCreate.ts"
import { queryCreate } from "#src/utils/convex_client/queryCreate.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import type { DocWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import { workspaceInvitationSchema } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import { WorkspaceInvitationAcceptView } from "#src/workspace/invitation_ui/accept/WorkspaceInvitationAcceptView.tsx"
import type { DocWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"
import { workspaceSchema } from "#src/workspace/workspace_model/workspaceSchema.ts"
import type { HasWorkspaceInvitationCode } from "#src/workspace/workspace_model_field/HasWorkspaceInvitationCode.ts"
import { urlWorkspaceView } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export function WorkspaceInvitationAcceptPage() {
  const params = useParams({ strict: false })
  const getInvitationCode = () => params().invitationCode
  return (
    <Switch>
      <Match when={!getInvitationCode()}>
        <ErrorPage title={ttc("Missing :invitationCode in path")} />
      </Match>
      <Match when={getInvitationCode()}>
        <WorkspaceInvitationPage invitationCode={getInvitationCode()!} />
      </Match>
    </Switch>
  )
}

interface WorkspaceInvitationPageProps extends MayHaveClass {
  invitationCode: string
}

function WorkspaceInvitationPage(p: WorkspaceInvitationPageProps) {
  return (
    <LayoutWrapperAuth title={getPageTitle()}>
      <PageWrapper>
        <WorkspaceInvitationAccept invitationCode={p.invitationCode} />
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}

function getPageTitle() {
  return ttc("Accept Invitation")
}

interface WorkspaceInvitationAcceptProps extends HasWorkspaceInvitationCode {}

function WorkspaceInvitationAccept(p: WorkspaceInvitationAcceptProps) {
  const acceptMutation = mutationCreate(api.workspace.workspaceInvitation50AcceptMutation)
  const invitationQuery = createQueryCached(
    queryCreate(api.workspace.workspaceInvitationGetQuery, {
      invitationCode: p.invitationCode,
    }),
    `workspaceInvitationGetQuery/${p.invitationCode}`,
    a.nullable(workspaceInvitationSchema),
  )

  const invitationResult = () => invitationQuery()
  const invitationData = () => {
    const result = invitationResult()
    if (!result?.success) return null
    return result.data
  }
  const workspaceHandle = () => invitationData()?.workspaceHandle ?? ""

  const getWorkspace = createQueryCached(
    queryCreate(api.workspace.workspaceGetQuery, () => ({
      token: userTokenGet(),
      workspaceHandle: workspaceHandle(),
    })),
    `workspaceGetQuery/${workspaceHandle()}`,
    a.nullable(workspaceSchema),
  )

  return (
    <Switch>
      <Match when={!invitationResult()}>
        <ErrorPage title={ttc("Loading invitation...")} />
      </Match>
      <Match when={!invitationResult()!.success}>
        <ErrorPage title={(invitationResult()! as ResultErr).errorMessage} />
      </Match>
      <Match when={!getWorkspace()}>
        <ErrorPage title={ttc("Loading workspace...")} />
      </Match>
      <Match when={!getWorkspace()!.success}>
        <ErrorPage title={(getWorkspace()! as ResultErr).errorMessage} />
      </Match>
      <Match when={true}>
        <WorkspaceInvitationAcceptView
          invitation={(invitationResult() as ResultOk<DocWorkspaceInvitation>).data}
          workspace={(getWorkspace() as ResultOk<DocWorkspace>).data}
          onAccept={() => handleAccept((invitationResult() as ResultOk<DocWorkspaceInvitation>).data, acceptMutation)}
        />
      </Match>
    </Switch>
  )
}

async function handleAccept(
  invitation: DocWorkspaceInvitation,
  acceptMutation: ReturnType<typeof mutationCreate<typeof api.workspace.workspaceInvitation50AcceptMutation>>,
) {
  const result = await acceptMutation({
    token: userTokenGet(),
    invitationCode: invitation.invitationCode,
  })

  if (!result.success) {
    toastAdd({
      icon: mdiAccountAlert,
      title: result.errorMessage,
      variant: toastVariant.error,
    })
    return
  }
  const session = result.data
  signInSessionNew(session)
  const url = urlWorkspaceView(invitation.workspaceHandle)
  navigateTo(url)
}
