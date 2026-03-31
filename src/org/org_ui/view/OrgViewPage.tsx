import { api } from "#convex/_generated/api.js"
import type { Result, ResultErr } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { OrgInvitationListSection } from "#src/org/invitation_ui/list/OrgInvitationListSection.tsx"
import { OrgMemberListSection } from "#src/org/member_ui/list/OrgMemberListSection.tsx"
import { orgViewPageSchema, type OrgViewPageType } from "#src/org/org_model/OrgViewPageType.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { orgNameSet } from "#src/org/org_ui/orgNameRecordSignal.ts"
import { OrgViewInformation } from "#src/org/org_ui/view/OrgViewInformation.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { useParams } from "@solidjs/router"
import { createEffect, Match, Switch } from "solid-js"

export function OrgViewPage() {
  const params = useParams()
  const getOrgHandleParam = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandleParam()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandleParam()}>
        {(getOrgHandle) => (
          <PageWrapper>
            <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}></NavOrg>
            <OrgViewLoader orgHandle={getOrgHandle()} />
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return orgName ?? ttc("Organization")
}

interface OrgViewLoaderProps extends HasOrgHandle, MayHaveClass {}

function OrgViewLoader(p: OrgViewLoaderProps) {
  const getDataQuery = createQuery(api.org.orgGetPageQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  const getDataResult = createQueryCached<OrgViewPageType>(
    getDataQuery,
    "orgGetPageQuery" + "/" + p.orgHandle,
    orgViewPageSchema,
  )

  return (
    <Switch>
      <Match when={!getDataResult()}>
        <ErrorPage title="Error loading organization" />
      </Match>
      <Match when={!getDataResult()!.success}>
        <ErrorPage title={(getDataResult()! as ResultErr).errorMessage || "Error loading organization"} />
      </Match>
      <Match when={getData(getDataResult)}>{(gotData) => <OrgViewAll {...gotData()} />}</Match>
    </Switch>
  )
}

function getData(getDataResult: () => Result<OrgViewPageType> | undefined): { data: OrgViewPageType } | null {
  const result = getDataResult()
  if (!result || !result.success) return null
  return { data: result.data }
}

interface OrgViewAllProps extends MayHaveClass {
  data: OrgViewPageType
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
      <OrgMemberListSection orgHandle={p.data.org.orgHandle} members={p.data.members} />
      <OrgInvitationListSection orgHandle={p.data.org.orgHandle} invitations={p.data.invitations} />
    </>
  )
}
