import type { ResultErr, ResultOk } from "#result"
import { ttc, ttc1 } from "#src/app/i18n/ttc.js"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavOrg } from "#src/app/nav/NavOrg.js"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import { urlUserProfileMe } from "#src/auth/url/pageRouteAuth.js"
import type { DocOrg } from "#src/org/org_convex/IdOrg.js"
import { OrgViewInformation } from "#src/org/org_ui/view/OrgViewInformation.js"
import { urlOrgLeave } from "#src/org/org_url/urlOrg.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { createMutation } from "#src/utils/convex_client/createMutation.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { Button } from "#ui/interactive/button/Button"
import { buttonVariant } from "#ui/interactive/button/buttonCva"
import { toastAdd } from "#ui/interactive/toast/toastAdd"
import { toastVariant } from "#ui/interactive/toast/toastVariant"
import { classesCardWrapperP8 } from "#ui/static/container/classesCardWrapper"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { classArr } from "#ui/utils/classArr"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { api } from "@convex/_generated/api.js"
import { mdiAccountAlert } from "@mdi/js"
import { useParams } from "@solidjs/router.js"
import { Match, Switch, createSignal } from "solid-js"

export function OrgLeavePage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <OrgLeavePageContent orgHandle={getOrgHandle()!} />
      </Match>
    </Switch>
  )
}

interface OrgLeavePageContentProps extends MayHaveClass {
  orgHandle: string
}

function OrgLeavePageContent(p: OrgLeavePageContentProps) {
  return (
    <LayoutWrapperAuth title={getPageTitle()}>
      <PageWrapper>
        <NavOrg orgHandle={p.orgHandle}>
          <NavLinkButton href={urlOrgLeave(p.orgHandle)} isActive={true}>
            {ttc("Leave Organization")}
          </NavLinkButton>
        </NavOrg>
        <OrgLeave orgHandle={p.orgHandle} />
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}

function getPageTitle() {
  return ttc("Leave Organization?")
}

interface OrgLeaveProps {
  orgHandle: string
}

function OrgLeave(p: OrgLeaveProps) {
  const getOrg = createQuery(api.org.orgGetPageQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })

  return (
    <Switch>
      <Match when={!getOrg()}>
        <ErrorPage title={ttc("Loading organization...")} />
      </Match>
      <Match when={!getOrg()!.success}>
        <ErrorPage title={(getOrg()! as ResultErr).errorMessage} />
      </Match>
      <Match when={true}>
        <OrgLeaveView org={(getOrg() as ResultOk<any>).data.org} />
      </Match>
    </Switch>
  )
}

interface OrgLeaveViewProps extends MayHaveClass {
  org: DocOrg
}

function OrgLeaveView(p: OrgLeaveViewProps) {
  return (
    <div class="space-y-6">
      <OrgViewInformation showEditButton={false} org={p.org} />
      <LeaveSection orgHandle={p.org.orgHandle!} orgName={p.org.name!} />
    </div>
  )
}

function LeaveSection(p: { orgHandle: string; orgName: string }) {
  return (
    <section class={classArr(classesCardWrapperP8, "max-w-md mx-auto", "mt-10 mb-15")}>
      <h2 class="text-xl font-semibold mb-4">{ttc("Leave Organization?")}</h2>
      <p class="text-muted-foreground mb-2">{ttc1("Are you sure you want to leave [X]?", p.orgName)}</p>
      <p class="text-muted-foreground mb-6">{ttc("You will lose access to all previously created data")}</p>
      <LeaveButton orgHandle={p.orgHandle} />
    </section>
  )
}

function LeaveButton(p: { orgHandle: string }) {
  const leaveMutation = createMutation(api.org.orgLeaveMutation)
  const [isLoading, setIsLoading] = createSignal(false)

  async function handleLeave() {
    setIsLoading(true)
    const leaveResult = await leaveMutation({
      token: userTokenGet(),
      orgHandle: p.orgHandle,
    })

    if (!leaveResult.success) {
      toastAdd({ icon: mdiAccountAlert, title: leaveResult.errorMessage, variant: toastVariant.error })
      setIsLoading(false)
      return
    }

    signInSessionNew(leaveResult.data)
    window.location.href = urlUserProfileMe()
  }

  return (
    <Button variant={buttonVariant.filledRed} onClick={handleLeave} disabled={isLoading()} class="w-full">
      {ttc("Leave Organization")}
    </Button>
  )
}
