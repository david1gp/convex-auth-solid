import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { OrgInvitationListSection } from "@/org/invitation_ui/list/OrgInvitationListSection"
import { OrgMemberListSection } from "@/org/member_ui/list/OrgMemberListSection"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import { orgViewPageSchema, type OrgViewPageType } from "@/org/org_model/OrgViewPageType"
import { orgNameSet } from "@/org/org_ui/orgNameRecordSignal"
import { OrgViewInformation } from "@/org/org_ui/view/OrgViewInformation"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { useParams } from "@solidjs/router"
import { createEffect, Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { ResultErr, ResultOk } from "~utils/result/Result"

export function OrgViewPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}></NavOrg>
          <OrgViewLoader orgHandle={getOrgHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return orgName ?? ttt("Organization")
}

interface OrgViewLoaderProps extends HasOrgHandle, MayHaveClass {}

function OrgViewLoader(p: OrgViewLoaderProps) {
  const getDataQuery = createQuery(api.org.orgGetPageQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  const getData = createQueryCached<OrgViewPageType>(
    getDataQuery,
    "orgGetPageQuery" + "/" + p.orgHandle,
    orgViewPageSchema,
  )
  return (
    <Switch>
      <Match when={!getData()}>
        <ErrorPage title="Error loading organization" />
      </Match>
      <Match when={!getData()!.success}>
        <ErrorPage title={(getData()! as ResultErr).errorMessage || "Error loading organization"} />
      </Match>
      <Match when={true}>
        <OrgViewAll data={(getData() as ResultOk<OrgViewPageType>).data} />
      </Match>
    </Switch>
  )
}

interface OrgViewAllProps extends MayHaveClass {
  data: OrgViewPageType
}

function OrgViewAll(p: OrgViewAllProps) {
  createEffect(() => {
    const orgInfo = p.data.org
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
