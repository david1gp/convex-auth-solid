import { mdiAccountAlert } from "@adaptive-ds/mdi/mdiAccountAlert.js"
import { useParams } from "@tanstack/solid-router"
import { createSignal, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { ResultErr, ResultOk } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { urlUserProfileMe } from "#src/auth/url/pageRouteAuth.ts"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import type { OrgViewPageType } from "#src/org/org_model/OrgViewPageType.ts"
import { OrgLeaveView } from "#src/org/org_ui/mutate/OrgLeaveView.tsx"
import { urlOrgLeave } from "#src/org/org_url/urlOrg.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { mutationCreate } from "#src/utils/convex_client/mutationCreate.ts"
import { queryCreate } from "#src/utils/convex_client/queryCreate.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export function OrgLeavePage() {
  const params = useParams({ strict: false })
  const getOrgHandle = () => params().orgHandle
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
  const getOrg = queryCreate(api.org.orgGetPageQuery, {
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
        <OrgLeaveViewLive org={(getOrg() as ResultOk<OrgViewPageType>).data.org} />
      </Match>
    </Switch>
  )
}

interface OrgLeaveViewProps extends MayHaveClass {
  org: OrgModel
}

function OrgLeaveViewLive(p: OrgLeaveViewProps) {
  const leaveMutation = mutationCreate(api.org.orgLeaveMutation)
  const [isLoading, setIsLoading] = createSignal(false)

  async function handleLeave() {
    setIsLoading(true)
    const leaveResult = await leaveMutation({
      token: userTokenGet(),
      orgHandle: p.org.orgHandle,
    })

    if (!leaveResult.success) {
      toastAdd({
        icon: mdiAccountAlert,
        title: leaveResult.errorMessage,
        variant: toastVariant.error,
      })
      setIsLoading(false)
      return
    }

    signInSessionNew(leaveResult.data)
    window.location.href = urlUserProfileMe()
  }

  return <OrgLeaveView org={p.org} onLeave={handleLeave} loading={isLoading()} />
}
