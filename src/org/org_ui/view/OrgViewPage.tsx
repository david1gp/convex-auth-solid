import { ttc } from "@/app/i18n/ttc"
import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { OrgInvitationListSection } from "@/org/invitation_ui/list/OrgInvitationListSection"
import { OrgMemberListSection } from "@/org/member_ui/list/OrgMemberListSection"
import { orgViewPageSchema, type OrgViewPageType } from "@/org/org_model/OrgViewPageType"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { orgNameSet } from "@/org/org_ui/orgNameRecordSignal"
import { OrgViewInformation } from "@/org/org_ui/view/OrgViewInformation"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { api } from "@convex/_generated/api"
import { useParams } from "@solidjs/router"
import { createEffect, Match, Switch } from "solid-js"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { Result, ResultErr } from "~utils/result/Result"

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
