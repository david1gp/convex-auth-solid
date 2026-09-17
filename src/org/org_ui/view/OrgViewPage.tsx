import { useParams } from "@tanstack/solid-router"
import { createEffect, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result, ResultErr } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.ts"
import { orgInvitationSchema } from "#src/org/invitation_model/orgInvitationSchema.ts"
import { OrgInvitationListSection } from "#src/org/invitation_ui/list/OrgInvitationListSection.tsx"
import { type OrgMemberProfile, orgMemberProfileSchema } from "#src/org/member_model/OrgMemberProfile.ts"
import { OrgMemberListSection } from "#src/org/member_ui/list/OrgMemberListSection.tsx"
import type { OrgViewPageType } from "#src/org/org_model/OrgViewPageType.ts"
import { orgViewPageSchema } from "#src/org/org_model/OrgViewPageType.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { orgNameSet } from "#src/org/org_ui/orgNameRecordSignal.ts"
import { OrgViewInformation } from "#src/org/org_ui/view/OrgViewInformation.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { queryCreate } from "#src/utils/convex_client/queryCreate.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface OrgMembersPagination {
  page: () => Result<PaginationResultType<OrgMemberProfile>> | undefined
  history: () => readonly (string | null)[]
  canPrevious: () => boolean
  canNext: () => boolean
  previous: () => void
  next: () => void
  loading: () => boolean
}

interface OrgInvitationsPagination {
  page: () => Result<PaginationResultType<OrgInvitationModel>> | undefined
  history: () => readonly (string | null)[]
  canPrevious: () => boolean
  canNext: () => boolean
  previous: () => void
  next: () => void
  loading: () => boolean
}

export function OrgViewPage() {
  const params = useParams({ strict: false })
  const getOrgHandleParam = () => params().orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandleParam()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandleParam()}>
        {(getOrgHandle) => (
          <PageWrapper>
            <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()} />
            <OrgViewLoader orgHandle={getOrgHandle()} />
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, _workspaceName?: string) {
  return orgName ?? ttc("Organization")
}

interface OrgViewLoaderProps extends HasOrgHandle, MayHaveClass {}

function OrgViewLoader(p: OrgViewLoaderProps) {
  const getDataQuery = queryCreate(api.org.orgGetPageQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  const getDataResult = createQueryCached<OrgViewPageType>(
    getDataQuery,
    `orgGetPageQuery/${p.orgHandle}`,
    orgViewPageSchema,
  )
  const membersPagination = cursorPaginationCreate({
    query: api.org.orgMembersListQuery,
    queryKey: "orgMembersListQuery",
    args: () => ({ token: userTokenGet(), orgHandle: p.orgHandle }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    scope: () => p.orgHandle,
    itemSchema: orgMemberProfileSchema,
  })
  const invitationsPagination = cursorPaginationCreate({
    query: api.org.orgInvitationsListQuery,
    queryKey: "orgInvitationsListQuery",
    args: () => ({ token: userTokenGet(), orgHandle: p.orgHandle }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    scope: () => p.orgHandle,
    itemSchema: orgInvitationSchema,
  })

  return (
    <Switch>
      <Match when={!getDataResult()}>
        <ErrorPage title="Error loading organization" />
      </Match>
      <Match when={!getDataResult()!.success}>
        <ErrorPage title={(getDataResult()! as ResultErr).errorMessage || "Error loading organization"} />
      </Match>
      <Match when={getData(getDataResult)}>
        {(gotData) => (
          <OrgViewAll
            data={gotData().data}
            membersPagination={membersPagination}
            invitationsPagination={invitationsPagination}
          />
        )}
      </Match>
    </Switch>
  )
}

function getData(getDataResult: () => Result<OrgViewPageType> | undefined): { data: OrgViewPageType } | null {
  const result = getDataResult()
  if (!result?.success) return null
  return { data: result.data }
}

interface OrgViewAllProps extends MayHaveClass {
  data: OrgViewPageType
  membersPagination: OrgMembersPagination
  invitationsPagination: OrgInvitationsPagination
}

function OrgViewAll(p: OrgViewAllProps) {
  createEffect(() => {
    const orgInfo = p.data.org
    if (!orgInfo.name) return
    orgNameSet(orgInfo.orgHandle, orgInfo.name)
  })
  return (
    <>
      <OrgViewInformation showEditButton={true} org={p.data.org} />
      <OrgMemberListSection
        orgHandle={p.data.org.orgHandle}
        members={getPaginationPage(p.membersPagination.page())?.page ?? []}
        pagination={p.membersPagination}
        loading={p.membersPagination.loading()}
      />
      <OrgInvitationListSection
        orgHandle={p.data.org.orgHandle}
        invitations={getPaginationPage(p.invitationsPagination.page())?.page ?? []}
        pagination={p.invitationsPagination}
        loading={p.invitationsPagination.loading()}
      />
    </>
  )
}

function getPaginationPage<T>(result: Result<PaginationResultType<T>> | undefined): PaginationResultType<T> | null {
  if (!result?.success) return null
  return result.data
}
