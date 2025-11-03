import { NavOrg } from "@/app/nav/NavOrg"
import { userSessionSignal, userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import type { HasOrgInvitationCode } from "@/org/org_model/HasOrgInvitationCode"
import { orgRoleText } from "@/org/org_model/orgRoleText"
import { OrgViewInformation } from "@/org/org_ui/view/OrgViewInformation"
import { urlOrgView } from "@/org/org_url/urlOrg"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { createMutation } from "@/utils/convex/createMutation"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { mdiAccountAlert } from "@mdi/js"
import { useNavigate, useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt, ttt1 } from "~ui/i18n/ttt"
import { formMode, getFormTitle } from "~ui/input/form/formMode"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { classesCardWrapperP8 } from "~ui/static/container/classesCardWrapper"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { ResultErr, ResultOk } from "~utils/result/Result"

const mode = formMode.remove

export function OrgInvitationAcceptPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  const getInvitationCode = () => params.invitationCode
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={!getInvitationCode()}>
        <ErrorPage title={ttt("Missing :invitationCode in path")} />
      </Match>
      <Match when={getInvitationCode()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            <LinkLikeText>{ttt("Invitation")}</LinkLikeText>
          </NavOrg>
          <OrgInvitationAccept orgHandle={getOrgHandle()!} invitationCode={getInvitationCode()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string) {
  const subject = orgName ?? ttt("Organization")
  return getFormTitle(mode, ttt1("Accept [X] Invitation?", subject))
}

interface OrgInvitationAcceptProps extends HasOrgHandle, HasOrgInvitationCode {}

function OrgInvitationAccept(p: OrgInvitationAcceptProps) {
  const invitationQuery = createQuery(api.org.orgInvitationGetQuery, {
    invitationCode: p.invitationCode,
  })

  const getOrg = createQuery(api.org.orgGetPageQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })

  return (
    <Switch>
      <Match when={!invitationQuery()}>
        <ErrorPage title={ttt("Loading invitation...")} />
      </Match>
      <Match when={!invitationQuery()!.success}>
        <ErrorPage title={(invitationQuery()! as ResultErr).errorMessage} />
      </Match>
      <Match when={!getOrg()}>
        <ErrorPage title={ttt("Loading organization...")} />
      </Match>
      <Match when={!getOrg()!.success}>
        <ErrorPage title={(getOrg()! as ResultErr).errorMessage} />
      </Match>
      <Match when={true}>
        <OrgInvitationAcceptView
          invitation={(invitationQuery() as ResultOk<DocOrgInvitation>).data}
          org={(getOrg() as ResultOk<any>).data.org}
        />
      </Match>
    </Switch>
  )
}

interface InvitationDetailsProps extends MayHaveClass {
  invitation: DocOrgInvitation
  org: DocOrg
}

function OrgInvitationAcceptView(p: InvitationDetailsProps) {
  return (
    <div class="space-y-6">
      <OrgViewInformation showEditButton={false} org={p.org} />
      <AcceptSection {...p} />
    </div>
  )
}

function AcceptSection(p: InvitationDetailsProps) {
  return (
    <section class={classArr(classesCardWrapperP8, "max-w-md mx-auto", "mt-10 mb-15")}>
      <h2 class="text-xl font-semibold mb-4">{ttt("Accept Invitation")}</h2>
      <p class="text-muted-foreground mb-4">
        {ttt("You have been invited to join as")} {orgRoleText[p.invitation.role]}.
      </p>
      <AcceptButton {...p} />
    </section>
  )
}

function AcceptButton(p: InvitationDetailsProps) {
  const navigate = useNavigate()
  const acceptMutation = createMutation(api.org.orgInvitationAcceptMutation)

  async function handleAccept() {
    const result = await acceptMutation({
      token: userTokenGet(),
      orgHandle: p.invitation.orgHandle,
      invitationCode: p.invitation.invitationCode,
    })

    if (!result.success) {
      toastAdd({ icon: mdiAccountAlert, title: result.errorMessage, variant: toastVariant.error })
      return
    }
    const session = result.data
    userSessionsSignalAdd(session)
    userSessionSignal.set(session)

    const url = urlOrgView(p.org.orgHandle)
    navigate(url)
  }
  return (
    <Button variant={buttonVariant.primary} onClick={handleAccept}>
      {ttt("Accept Invitation")}
    </Button>
  )
}
