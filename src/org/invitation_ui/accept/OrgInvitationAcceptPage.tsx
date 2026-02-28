import { ttc, ttc1 } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { signInSessionNew } from "@/auth/ui/sign_in/logic/signInSessionNew"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { orgInvitationSchema } from "@/org/invitation_model/orgInvitationSchema"
import { urlOrgInvitationAccept } from "@/org/invitation_url/urlOrgInvitation"
import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import type { HasOrgInvitationCode } from "@/org/org_model_field/HasOrgInvitationCode"
import { orgRoleGetText } from "@/org/org_model_field/orgRoleGetText"
import { OrgViewInformation } from "@/org/org_ui/view/OrgViewInformation"
import { urlOrgView } from "@/org/org_url/urlOrg"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createMutation } from "@/utils/convex_client/createMutation"
import { createQuery } from "@/utils/convex_client/createQuery"
import { navigateTo } from "@/utils/router/navigateTo"
import { api } from "@convex/_generated/api"
import { mdiAccountAlert } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import * as a from "valibot"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { classesCardWrapperP8 } from "~ui/static/container/classesCardWrapper"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { ResultErr, ResultOk } from "~utils/result/Result"

export function OrgInvitationAcceptPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  const getInvitationCode = () => params.invitationCode
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={!getInvitationCode()}>
        <ErrorPage title={ttc("Missing :invitationCode in path")} />
      </Match>
      <Match when={getInvitationCode()}>
        <OrgInvitationPage orgHandle={getOrgHandle()!} invitationCode={getInvitationCode()!} />
      </Match>
    </Switch>
  )
}

interface OrgInvitationPageProps extends MayHaveClass {
  orgHandle: string
  invitationCode: string
}

function OrgInvitationPage(p: OrgInvitationPageProps) {
  return (
    <LayoutWrapperAuth title={getPageTitle(p.orgHandle)}>
      <PageWrapper>
        <NavOrg orgHandle={p.orgHandle}>
          <NavLinkButton href={urlOrgInvitationAccept(p.orgHandle, p.invitationCode)} isActive={true}>
            {ttc("Invitation")}
          </NavLinkButton>
        </NavOrg>
        <OrgInvitationAccept orgHandle={p.orgHandle} invitationCode={p.invitationCode} />
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}

function getPageTitle(orgName?: string) {
  const subject = orgName ?? ttc("Organization")
  return ttc1("Accept [X] Invitation?", subject)
}

interface OrgInvitationAcceptProps extends HasOrgHandle, HasOrgInvitationCode {}

function OrgInvitationAccept(p: OrgInvitationAcceptProps) {
  const invitationQuery = createQueryCached(
    createQuery(api.org.orgInvitationGetQuery, {
      invitationCode: p.invitationCode,
    }),
    "orgInvitationGetQuery" + "/" + p.invitationCode,
    a.nullable(orgInvitationSchema),
  )

  const getOrg = createQueryCached(
    createQuery(api.org.orgGetPageQuery, {
      token: userTokenGet(),
      orgHandle: p.orgHandle,
    }),
    "orgGetPageQuery" + "/" + p.orgHandle,
    a.any(),
  )

  return (
    <Switch>
      <Match when={!invitationQuery()}>
        <ErrorPage title={ttc("Loading invitation...")} />
      </Match>
      <Match when={!invitationQuery()!.success}>
        <ErrorPage title={(invitationQuery()! as ResultErr).errorMessage} />
      </Match>
      <Match when={!getOrg()}>
        <ErrorPage title={ttc("Loading organization...")} />
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
      <h2 class="text-xl font-semibold mb-4">{ttc("Accept Invitation")}</h2>
      <p class="text-muted-foreground mb-4">
        {ttc("You have been invited to join as")} {orgRoleGetText(p.invitation.role)}.
      </p>
      <AcceptButton {...p} />
    </section>
  )
}

function AcceptButton(p: InvitationDetailsProps) {
  const acceptMutation = createMutation(api.org.orgInvitation50AcceptMutation)

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
    signInSessionNew(session)
    const url = urlOrgView(p.org.orgHandle)
    navigateTo(url)
  }
  return (
    <Button variant={buttonVariant.primary} onClick={handleAccept}>
      {ttc("Accept Invitation")}
    </Button>
  )
}
