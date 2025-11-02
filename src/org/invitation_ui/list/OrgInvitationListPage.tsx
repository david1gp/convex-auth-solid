import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { NoOrgInvitations } from "@/org/invitation_ui/list/NoOrgInvitations"
import { urlOrgInvitationAdd, urlOrgInvitationView } from "@/org/invitation_url/urlOrgInvitation"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import { PageHeader } from "@/ui/header/PageHeader"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { mdiPlus } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"
import type { Result, ResultOk } from "~utils/result/Result"

export function OrgInvitationListPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            {ttt("Invitations")}
          </NavOrg>
          <OrgInvitationListLoader orgHandle={getOrgHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string) {
  const name = orgName ?? ttt("Organization")
  return name + ttt(" Invitations")
}

type OrgInvitation = DocOrgInvitation

type FetchOrgInvitations = Accessor<Result<OrgInvitation[]> | undefined>

interface OrgInvitationListLoaderProps extends HasOrgHandle {}

function OrgInvitationListLoader(p: OrgInvitationListLoaderProps) {
  const getOrgInvitationsResult: FetchOrgInvitations = createQuery(api.org.orgInvitationsListQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  createEffect(() => {
    const orgInvitationsResult = getOrgInvitationsResult()
    if (!orgInvitationsResult) return
    if (!orgInvitationsResult.success) return
    // orgInvitationListSignal.set(orgInvitationsResult.data)
  })

  return (
    <>
      <PageHeader title={ttt("Organization Invitations")} subtitle={ttt("Manage invitations of this organization")}>
        <OrgInvitationCreateLink orgHandle={p.orgHandle} />
      </PageHeader>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={getOrgInvitationsResult() === undefined}>
          <OrgInvitationLoading />
        </Match>
        <Match when={!hasOrgInvitations(getOrgInvitationsResult())}>
          <NoOrgInvitations />
        </Match>
        <Match when={true}>
          <OrgInvitationList orgHandle={p.orgHandle} getOrgInvitations={getOrgInvitations(getOrgInvitationsResult())} />
        </Match>
      </Switch>
    </>
  )
}

function getOrgInvitations(orgInvitationsResult: Result<OrgInvitation[]> | undefined): Accessor<OrgInvitation[]> {
  return () => {
    return (orgInvitationsResult as ResultOk<OrgInvitation[]>).data
  }
}

interface OrgInvitationListProps extends HasOrgHandle {
  getOrgInvitations: Accessor<OrgInvitation[]>
}

function OrgInvitationList(p: OrgInvitationListProps) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={p.getOrgInvitations()}>
        {(invitation) => <OrgInvitationLink orgHandle={p.orgHandle} invitation={invitation} />}
      </For>
    </div>
  )
}

function hasOrgInvitations(orgInvitationsResult: Result<OrgInvitation[]> | undefined): OrgInvitation[] | null {
  if (!orgInvitationsResult) return null
  if (!orgInvitationsResult.success) return null
  const orgInvitations = orgInvitationsResult.data
  if (orgInvitations.length <= 0) return null
  return orgInvitations
}

function OrgInvitationLoading() {
  return <LoadingSection loadingSubject={ttt("Organization Invitations")} />
}

interface OrgInvitationLinkProps extends HasOrgHandle {
  invitation: OrgInvitation
}

function OrgInvitationLink(p: OrgInvitationLinkProps) {
  return (
    <LinkButton href={urlOrgInvitationView(p.orgHandle, p.invitation.invitationCode)}>
      {p.invitation.invitedEmail}
    </LinkButton>
  )
}

function OrgInvitationCreateLink(p: HasOrgHandle) {
  return (
    <LinkButton icon={mdiPlus} href={urlOrgInvitationAdd(p.orgHandle)} variant={buttonVariant.success}>
      {ttt("Add Invitation")}
    </LinkButton>
  )
}
