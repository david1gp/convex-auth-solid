import { ttc, ttc1 } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { signInSessionNew } from "@/auth/ui/sign_in/logic/signInSessionNew"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { urlUserProfileMe } from "@/auth/url/pageRouteAuth"
import type { DocOrg } from "@/org/org_convex/IdOrg"
import { OrgViewInformation } from "@/org/org_ui/view/OrgViewInformation"
import { urlOrgLeave } from "@/org/org_url/urlOrg"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { createMutation } from "@/utils/convex_client/createMutation"
import { createQuery } from "@/utils/convex_client/createQuery"
import { api } from "@convex/_generated/api"
import { mdiAccountAlert } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { Match, Switch, createSignal } from "solid-js"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { classesCardWrapperP8 } from "~ui/static/container/classesCardWrapper"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { ResultErr, ResultOk } from "~utils/result/Result"

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
    <Button variant={buttonVariant.destructive} onClick={handleLeave} disabled={isLoading()} class="w-full">
      {ttc("Leave Organization")}
    </Button>
  )
}
