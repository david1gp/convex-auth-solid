import { api } from "#convex/_generated/api.js"
import type { ResultErr, ResultOk } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { createMutation } from "#src/utils/convex_client/createMutation.ts"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import type { DocWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import { workspaceInvitationSchema } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import type { DocWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"
import type { HasWorkspaceInvitationCode } from "#src/workspace/workspace_model_field/HasWorkspaceInvitationCode.ts"
import { workspaceRoleGetText } from "#src/workspace/workspace_model_field/workspaceRoleGetText.ts"
import { WorkspaceViewInformation } from "#src/workspace/workspace_ui/view/WorkspaceViewInformation.tsx"
import { urlWorkspaceView } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { Button } from "#ui/interactive/button/Button.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import { classesCardWrapperP8 } from "#ui/static/card/classesCardWrapper.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { mdiAccountAlert } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import * as a from "valibot"

export function WorkspaceInvitationAcceptPage() {
  const params = useParams()
  const getInvitationCode = () => params.invitationCode
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
  const invitationQuery = createQueryCached(
    createQuery(api.workspace.workspaceInvitationGetQuery, {
      invitationCode: p.invitationCode,
    }),
    "workspaceInvitationGetQuery" + "/" + p.invitationCode,
    a.nullable(workspaceInvitationSchema),
  )

  const invitationResult = () => invitationQuery()
  const invitationData = () => {
    const result = invitationResult()
    if (!result || !result.success) return null
    return result.data
  }
  const workspaceHandle = () => invitationData()?.workspaceHandle ?? ""

  const getWorkspace = createQueryCached(
    createQuery(api.workspace.workspaceGetQuery, {
      token: userTokenGet(),
      workspaceHandle: workspaceHandle(),
    }),
    "workspaceGetQuery" + "/" + workspaceHandle(),
    a.any(),
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
        />
      </Match>
    </Switch>
  )
}

interface InvitationDetailsProps extends MayHaveClass {
  invitation: DocWorkspaceInvitation
  workspace: DocWorkspace
}

function WorkspaceInvitationAcceptView(p: InvitationDetailsProps) {
  return (
    <div class="space-y-6">
      <WorkspaceViewInformation showEditButton={false} workspace={p.workspace} />
      <AcceptSection {...p} />
    </div>
  )
}

function AcceptSection(p: InvitationDetailsProps) {
  return (
    <section class={classArr(classesCardWrapperP8, "max-w-md mx-auto", "mt-10 mb-15")}>
      <h2 class="text-xl font-semibold mb-4">{ttc("Accept Invitation")}</h2>
      <p class="text-muted-foreground mb-4">
        {ttc("You have been invited to join workspace as")} {workspaceRoleGetText(p.invitation.role)}.
      </p>
      <AcceptButton {...p} />
    </section>
  )
}

function AcceptButton(p: InvitationDetailsProps) {
  const acceptMutation = createMutation(api.workspace.workspaceInvitation50AcceptMutation)

  async function handleAccept() {
    const result = await acceptMutation({
      token: userTokenGet(),
      invitationCode: p.invitation.invitationCode,
    })

    if (!result.success) {
      toastAdd({ icon: mdiAccountAlert, title: result.errorMessage, variant: toastVariant.error })
      return
    }
    const session = result.data
    signInSessionNew(session)
    const url = urlWorkspaceView(p.invitation.workspaceHandle)
    navigateTo(url)
  }
  return (
    <Button variant={buttonVariant.filledIndigo} onClick={handleAccept}>
      {ttc("Accept Invitation")}
    </Button>
  )
}
