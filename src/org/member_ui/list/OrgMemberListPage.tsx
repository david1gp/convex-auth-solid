import { useParams } from "@tanstack/solid-router"
import { Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { type OrgMemberProfile, orgMemberProfileSchema } from "#src/org/member_model/OrgMemberProfile.ts"
import { OrgMemberListView } from "#src/org/member_ui/list/OrgMemberListView.tsx"
import { urlOrgMemberAdd, urlOrgMemberList, urlOrgMemberView } from "#src/org/member_url/urlOrgMember.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
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
    <OrgMemberListView
      members={pagination.page() === undefined ? undefined : (getOrgMembersPage(pagination.page())?.page ?? [])}
      failed={pagination.page() !== undefined && getOrgMembersPage(pagination.page()) === null}
      addHref={urlOrgMemberAdd(p.orgHandle)}
      viewHref={(memberId) => urlOrgMemberView(p.orgHandle, memberId)}
      pagination={{
        page: () => pagination.history().length + 1,
        canPrevious: pagination.canPrevious,
        canNext: pagination.canNext,
        previous: pagination.previous,
        next: pagination.next,
        loading: pagination.loading,
      }}
    />
  )
}

export function NoOrgMembers(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Members")} class={p.class}>
      {p.children}
    </NoData>
  )
}

function getOrgMembersPage(
  orgMembersResult: Result<PaginationResultType<OrgMember>> | undefined,
): PaginationResultType<OrgMember> | null {
  if (!orgMembersResult?.success) return null
  return orgMembersResult.data
}
