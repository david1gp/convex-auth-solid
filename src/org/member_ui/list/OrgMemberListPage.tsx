import { mdiAccountMultiple } from "@adaptive-ds/mdi/mdiAccountMultiple.js"
import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { useParams } from "@tanstack/solid-router"
import { For, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { type OrgMemberProfile, orgMemberProfileSchema } from "#src/org/member_model/OrgMemberProfile.ts"
import { urlOrgMemberAdd, urlOrgMemberList, urlOrgMemberView } from "#src/org/member_url/urlOrgMember.ts"
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
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

export function OrgMemberListPage() {
  const params = useParams({ strict: false })
  const getOrgHandle = () => params().orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            <NavLinkButton href={urlOrgMemberList(getOrgHandle()!)} isActive={true}>
              {ttc("Members")}
            </NavLinkButton>
          </NavOrg>
          <OrgMemberListLoader orgHandle={getOrgHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string) {
  const name = orgName ?? ttc("Organization")
  return `${name} ${ttc("Members")}`
}

type OrgMember = OrgMemberProfile

interface OrgMemberListLoaderProps extends HasOrgHandle {}

function OrgMemberListLoader(p: OrgMemberListLoaderProps) {
  const pagination = cursorPaginationCreate({
    query: api.org.orgMembersListQuery,
    queryKey: "orgMembersListQuery",
    args: () => ({ token: userTokenGet(), orgHandle: p.orgHandle }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    scope: () => p.orgHandle,
    itemSchema: orgMemberProfileSchema,
  })

  return (
    <>
      <PageHeader
        icon={mdiAccountMultiple}
        title={ttc("Organization Members")}
        subtitle={ttc("Manage members of this organization")}
        class="mb-4"
      >
        <OrgMemberCreateLink orgHandle={p.orgHandle} />
      </PageHeader>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={pagination.page() === undefined}>
          <OrgMemberLoading />
        </Match>
        <Match when={resultHasNoOrgMembers(pagination.page())}>
          <NoOrgMembers />
        </Match>
        <Match when={getOrgMembersPage(pagination.page())}>
          {(getPage) => <OrgMemberList orgHandle={p.orgHandle} members={getPage().page} pagination={pagination} />}
        </Match>
      </Switch>
    </>
  )
}

export function NoOrgMembers(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Members")} class={p.class}>
      {p.children}
    </NoData>
  )
}

interface OrgMemberListProps extends HasOrgHandle {
  members: OrgMember[]
  pagination: ReturnType<typeof cursorPaginationCreate<typeof api.org.orgMembersListQuery, OrgMember>>
}

function OrgMemberList(p: OrgMemberListProps) {
  return (
    <>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={p.members}>{(member) => <OrgMemberLink orgHandle={p.orgHandle} member={member} />}</For>
      </div>
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

function getOrgMembersPage(
  orgMembersResult: Result<PaginationResultType<OrgMember>> | undefined,
): PaginationResultType<OrgMember> | null {
  if (!orgMembersResult?.success) return null
  return orgMembersResult.data
}

function resultHasNoOrgMembers(orgMembersResult: Result<PaginationResultType<OrgMember>> | undefined): boolean {
  const page = getOrgMembersPage(orgMembersResult)
  return page !== null && page.page.length <= 0
}

function OrgMemberLoading() {
  return <LoadingSection loadingSubject={ttc("Organization Members")} />
}

interface OrgMemberLinkProps extends HasOrgHandle {
  member: OrgMember
}

function OrgMemberLink(p: OrgMemberLinkProps) {
  return (
    <LinkButtonInternal to={urlOrgMemberView(p.orgHandle, p.member.memberId)}>{p.member.userId}</LinkButtonInternal>
  )
}

function OrgMemberCreateLink(p: HasOrgHandle) {
  return (
    <LinkButtonInternal icon={mdiPlus} to={urlOrgMemberAdd(p.orgHandle)} variant={buttonVariant.filledGreen}>
      {ttc("Add Member")}
    </LinkButtonInternal>
  )
}
