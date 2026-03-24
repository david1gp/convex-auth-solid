import { api } from "#convex/_generated/api.js"
import type { ResultErr, ResultOk } from "#result"
import { ttc, ttc1 } from "#src/app/i18n/ttc.js"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.jsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavOrg } from "#src/app/nav/NavOrg.jsx"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.js"
import { orgInvitationSchema } from "#src/org/invitation_model/orgInvitationSchema.js"
import { urlOrgInvitationAccept } from "#src/org/invitation_url/urlOrgInvitation.js"
import type { DocOrg } from "#src/org/org_convex/IdOrg.js"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.js"
import type { HasOrgInvitationCode } from "#src/org/org_model_field/HasOrgInvitationCode.js"
import { orgRoleGetText } from "#src/org/org_model_field/orgRoleGetText.js"
import { OrgViewInformation } from "#src/org/org_ui/view/OrgViewInformation.jsx"
import { urlOrgView } from "#src/org/org_url/urlOrg.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.jsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createMutation } from "#src/utils/convex_client/createMutation.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { navigateTo } from "#src/utils/router/navigateTo.js"
import { Button } from "#ui/interactive/button/Button.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { toastAdd } from "#ui/interactive/toast/toastAdd.js"
import { toastVariant } from "#ui/interactive/toast/toastVariant.js"
import { classesCardWrapperP8 } from "#ui/static/card/classesCardWrapper.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { mdiAccountAlert } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import * as a from "valibot"

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
    <Button variant={buttonVariant.filledIndigo} onClick={handleAccept}>
      {ttc("Accept Invitation")}
    </Button>
  )
}
