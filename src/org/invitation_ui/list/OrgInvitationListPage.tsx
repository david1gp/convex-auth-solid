import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { useParams } from "@tanstack/solid-router"
import { For, Match, Show, Switch, splitProps } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import { LinkLikeNavText } from "#src/app/nav/links/LinkLikeNavText.tsx"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.ts"
import { orgInvitationSchema } from "#src/org/invitation_model/orgInvitationSchema.ts"
import type { OrgInvitationsProps } from "#src/org/invitation_ui/list/OrgInvitationListSection.tsx"
import { OrgInvitationCard } from "#src/org/invitation_ui/view/OrgInvitationCard.tsx"
import { urlOrgInvitationAdd } from "#src/org/invitation_url/urlOrgInvitation.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

export function OrgInvitationListPage() {
  const params = useParams({ strict: false })
  const getOrgHandle = () => params().orgHandle
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
  return `${name} ${ttc("Invitations")}`
}

interface OrgInvitationListLoaderProps extends HasOrgHandle {}

function OrgInvitationListLoader(p: OrgInvitationListLoaderProps) {
  const pagination = cursorPaginationCreate({
    query: api.org.orgInvitationsListQuery,
    queryKey: "orgInvitationsListQuery",
    args: () => ({ token: userTokenGet(), orgHandle: p.orgHandle }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    scope: () => p.orgHandle,
    itemSchema: orgInvitationSchema,
  })

  return (
    <>
      <PageHeader
        title={ttc("Organization Invitations")}
        subtitle={ttc("Manage invitations of this organization")}
        class="mb-4"
      >
        <LinkButtonInternal icon={mdiPlus} to={urlOrgInvitationAdd(p.orgHandle)} variant={buttonVariant.filledGreen}>
          {ttc("Add Invitation")}
        </LinkButtonInternal>
      </PageHeader>
      <Switch fallback={<p>Fallback content</p>}>
        <Match when={pagination.page() === undefined}>
          <OrgInvitationLoading />
        </Match>
        <Match when={resultHasNoOrgInvitations(pagination.page())}>
          <NoOrgInvitationsSection />
        </Match>
        <Match when={getOrgInvitationsPage(pagination.page())}>
          {(getPage) => (
            <OrgInvitationList orgHandle={p.orgHandle} invitations={getPage().page} pagination={pagination} />
          )}
        </Match>
      </Switch>
    </>
  )
}

function getOrgInvitationsPage(
  orgInvitationsResult: Result<PaginationResultType<OrgInvitationModel>> | undefined,
): PaginationResultType<OrgInvitationModel> | null {
  if (!orgInvitationsResult?.success) return null
  return orgInvitationsResult.data
}

function resultHasNoOrgInvitations(
  orgInvitationsResult: Result<PaginationResultType<OrgInvitationModel>> | undefined,
): boolean {
  const page = getOrgInvitationsPage(orgInvitationsResult)
  return page !== null && page.page.length <= 0
}

function OrgInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Organization Invitations")} />
}

interface OrgInvitationListPageProps extends Omit<OrgInvitationsProps, "pagination"> {
  pagination: ReturnType<typeof cursorPaginationCreate<typeof api.org.orgInvitationsListQuery, OrgInvitationModel>>
}

function OrgInvitationList(p: OrgInvitationListPageProps) {
  const [, rest] = splitProps(p, ["class", "pagination", "loading"])
  return (
    <>
      <Show when={p.invitations.length > 0} fallback={<NoOrgInvitationsSection />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations}>{(invitation) => <OrgInvitationCard {...rest} invitation={invitation} />}</For>
        </div>
      </Show>
      <PaginationControls
        page={() => p.pagination.history().length + 1}
        canPrevious={p.pagination.canPrevious}
        canNext={p.pagination.canNext}
        previous={p.pagination.previous}
        next={p.pagination.next}
        loading={p.pagination.loading}
      />
    </>
  )
}

export function NoOrgInvitationsSection(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Organization Invitations")} class={p.class}>
      {p.children}
    </NoData>
  )
}
