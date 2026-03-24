import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.js"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.js"
import { LinkLikeNavText } from "#src/app/nav/links/LinkLikeNavText.js"
import { NavOrg } from "#src/app/nav/NavOrg.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.js"
import type { OrgInvitationsProps } from "#src/org/invitation_ui/list/OrgInvitationListSection.js"
import { OrgInvitationCard } from "#src/org/invitation_ui/view/OrgInvitationCard.js"
import { urlOrgInvitationAdd } from "#src/org/invitation_url/urlOrgInvitation.js"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.js"
import { PageHeader } from "#src/ui/header/PageHeader.js"
import { NoData } from "#src/ui/illustrations/NoData.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { LoadingSection } from "#src/ui/pages/LoadingSection.js"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva"
import { LinkButton } from "#ui/interactive/link/LinkButton"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren"
import { api } from "@convex/_generated/api.js"
import { mdiPlus } from "@mdi/js"
import { useParams } from "@solidjs/router.js"
import { createEffect, For, Match, Show, splitProps, Switch, type Accessor } from "solid-js"
import * as a from "valibot"

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
        <LinkButton icon={mdiPlus} href={urlOrgInvitationAdd(p.orgHandle)} variant={buttonVariant.filledGreen}>
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
