import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import { LinkLikeNavText } from "@/app/nav/links/LinkLikeNavText"
import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import type { OrgInvitationsProps } from "@/org/invitation_ui/list/OrgInvitationListSection"
import { OrgInvitationCard } from "@/org/invitation_ui/view/OrgInvitationCard"
import { urlOrgInvitationAdd } from "@/org/invitation_url/urlOrgInvitation"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { PageHeader } from "@/ui/header/PageHeader"
import { NoData } from "@/ui/illustrations/NoData"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { api } from "@convex/_generated/api"
import { mdiPlus } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { createEffect, For, Match, Show, splitProps, Switch, type Accessor } from "solid-js"
import * as a from "valibot"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"
import type { Result } from "~utils/result/Result"

export function OrgInvitationListPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>{(getHandle) => <ListPage orgHandle={getHandle()} />}</Match>
    </Switch>
  )
}

interface ListPageProps extends HasOrgHandle, MayHaveClass {}

function ListPage(p: ListPageProps) {
  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <NavOrg getOrgPageTitle={getPageTitle} orgHandle={p.orgHandle}>
          <LinkLikeNavText>{ttc("Invitations")}</LinkLikeNavText>
        </NavOrg>
        <OrgInvitationListLoader orgHandle={p.orgHandle} />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

function getPageTitle(orgName?: string) {
  const name = orgName ?? ttc("Organization")
  return name + " " + ttc("Invitations")
}

type FetchOrgInvitations = Accessor<Result<OrgInvitationModel[]> | undefined>

interface OrgInvitationListLoaderProps extends HasOrgHandle {}

function OrgInvitationListLoader(p: OrgInvitationListLoaderProps) {
  const getOrgInvitationsQuery: FetchOrgInvitations = createQuery(api.org.orgInvitationsListQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  const getOrgInvitationsResult = createQueryCached<OrgInvitationModel[]>(
    getOrgInvitationsQuery,
    "orgInvitationsListQuery" + "/" + p.orgHandle,
    a.any(),
  )
  createEffect(() => {
    const orgInvitationsResult = getOrgInvitationsResult()
    if (!orgInvitationsResult) return
    if (!orgInvitationsResult.success) return
    // orgInvitationListSignal.set(orgInvitationsResult.data)
  })

  return (
    <>
      <PageHeader
        title={ttc("Organization Invitations")}
        subtitle={ttc("Manage invitations of this organization")}
        class="mb-4"
      >
        <LinkButton icon={mdiPlus} href={urlOrgInvitationAdd(p.orgHandle)} variant={buttonVariant.success}>
          {ttc("Add Invitation")}
        </LinkButton>
      </PageHeader>
      <Switch fallback={<p>Fallback content</p>}>
        <Match when={getOrgInvitationsResult() === undefined}>
          <OrgInvitationLoading />
        </Match>
        <Match when={!hasOrgInvitations(getOrgInvitationsResult())}>
          <NoOrgInvitationsSection />
        </Match>
        <Match when={getData(getOrgInvitationsResult)}>
          {(gotData) => <OrgInvitationList orgHandle={p.orgHandle} {...gotData()} />}
        </Match>
      </Switch>
    </>
  )
}

function getData(
  orgInvitationsResult: () => Result<OrgInvitationModel[]> | undefined,
): { invitations: OrgInvitationModel[] } | null {
  const result = orgInvitationsResult()
  if (!result || !result.success) return null
  return { invitations: result.data }
}

function hasOrgInvitations(
  orgInvitationsResult: Result<OrgInvitationModel[]> | undefined,
): OrgInvitationModel[] | null {
  if (!orgInvitationsResult) return null
  if (!orgInvitationsResult.success) return null
  const orgInvitations = orgInvitationsResult.data
  if (orgInvitations.length <= 0) return null
  return orgInvitations
}

function OrgInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Organization Invitations")} />
}

function OrgInvitationList(p: OrgInvitationsProps) {
  const [s, rest] = splitProps(p, ["class"])
  return (
    <Show when={p.invitations.length > 0} fallback={<NoOrgInvitationsSection />}>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={p.invitations}>{(invitation) => <OrgInvitationCard {...rest} invitation={invitation} />}</For>
      </div>
    </Show>
  )
}

export function NoOrgInvitationsSection(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Organization Invitations")} class={p.class}>
      {p.children}
    </NoData>
  )
}
