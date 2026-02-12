import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"
import { urlOrgMemberAdd, urlOrgMemberList, urlOrgMemberView } from "@/org/member_url/urlOrgMember"
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
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import * as a from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"
import type { Result, ResultOk } from "~utils/result/Result"

export function OrgMemberListPage() {
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
            <NavLinkButton href={urlOrgMemberList(getOrgHandle()!)} isActive={true}>
              {ttt("Members")}
            </NavLinkButton>
          </NavOrg>
          <OrgMemberListLoader orgHandle={getOrgHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string) {
  const name = orgName ?? ttt("Organization")
  return name + " " + ttt("Members")
}

type OrgMember = OrgMemberModel

type FetchOrgMembers = Accessor<Result<OrgMember[]> | undefined>

interface OrgMemberListLoaderProps extends HasOrgHandle {}

function OrgMemberListLoader(p: OrgMemberListLoaderProps) {
  const getOrgMembersQuery: FetchOrgMembers = createQuery(api.org.orgMembersListQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  const getOrgMembersResult = createQueryCached<OrgMember[]>(
    getOrgMembersQuery,
    "orgMembersListQuery" + "/" + p.orgHandle,
    a.any(),
  )
  createEffect(() => {
    const orgMembersResult = getOrgMembersResult()
    if (!orgMembersResult) return
    if (!orgMembersResult.success) return
    // orgMemberListSignal.set(orgMembersResult.data)
  })

  return (
    <>
      <PageHeader title={ttt("Organization Members")} subtitle={ttt("Manage members of this organization")}>
        <OrgMemberCreateLink orgHandle={p.orgHandle} />
      </PageHeader>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={getOrgMembersResult() === undefined}>
          <OrgMemberLoading />
        </Match>
        <Match when={!hasOrgMembers(getOrgMembersResult())}>
          <NoOrgMembers />
        </Match>
        <Match when={true}>
          <OrgMemberList orgHandle={p.orgHandle} getOrgMembers={getOrgMembers(getOrgMembersResult())} />
        </Match>
      </Switch>
    </>
  )
}

export function NoOrgMembers(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttt("No Members")} class={p.class}>
      {p.children}
    </NoData>
  )
}

function getOrgMembers(orgMembersResult: Result<OrgMember[]> | undefined): Accessor<OrgMember[]> {
  return () => {
    return (orgMembersResult as ResultOk<OrgMember[]>).data
  }
}

interface OrgMemberListProps extends HasOrgHandle {
  getOrgMembers: Accessor<OrgMember[]>
}

function OrgMemberList(p: OrgMemberListProps) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={p.getOrgMembers()}>{(member) => <OrgMemberLink orgHandle={p.orgHandle} member={member} />}</For>
    </div>
  )
}

function hasOrgMembers(orgMembersResult: Result<OrgMember[]> | undefined): OrgMember[] | null {
  if (!orgMembersResult) return null
  if (!orgMembersResult.success) return null
  const orgMembers = orgMembersResult.data
  if (orgMembers.length <= 0) return null
  return orgMembers
}

function OrgMemberLoading() {
  return <LoadingSection loadingSubject={ttt("Organization Members")} />
}

interface OrgMemberLinkProps extends HasOrgHandle {
  member: OrgMember
}

function OrgMemberLink(p: OrgMemberLinkProps) {
  return <LinkButton href={urlOrgMemberView(p.orgHandle, p.member.memberId)}>{p.member.userId}</LinkButton>
}

function OrgMemberCreateLink(p: HasOrgHandle) {
  return (
    <LinkButton icon={mdiPlus} href={urlOrgMemberAdd(p.orgHandle)} variant={buttonVariant.success}>
      {ttt("Add Member")}
    </LinkButton>
  )
}
