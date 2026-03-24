import type { Result, ResultOk } from "#result"
import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavOrg } from "#src/app/nav/NavOrg.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { OrgMemberModel } from "#src/org/member_model/OrgMemberModel.js"
import { urlOrgMemberAdd, urlOrgMemberList, urlOrgMemberView } from "#src/org/member_url/urlOrgMember.js"
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
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren"
import { api } from "@convex/_generated/api.js"
import { mdiAccountMultiple, mdiPlus } from "@mdi/js"
import { useParams } from "@solidjs/router.js"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import * as a from "valibot"

export function OrgMemberListPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
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
  return name + " " + ttc("Members")
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
      <PageHeader
        icon={mdiAccountMultiple}
        title={ttc("Organization Members")}
        subtitle={ttc("Manage members of this organization")}
        class="mb-4"
      >
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
    <NoData noDataText={ttc("No Members")} class={p.class}>
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
  return <LoadingSection loadingSubject={ttc("Organization Members")} />
}

interface OrgMemberLinkProps extends HasOrgHandle {
  member: OrgMember
}

function OrgMemberLink(p: OrgMemberLinkProps) {
  return <LinkButton href={urlOrgMemberView(p.orgHandle, p.member.memberId)}>{p.member.userId}</LinkButton>
}

function OrgMemberCreateLink(p: HasOrgHandle) {
  return (
    <LinkButton icon={mdiPlus} href={urlOrgMemberAdd(p.orgHandle)} variant={buttonVariant.filledGreen}>
      {ttc("Add Member")}
    </LinkButton>
  )
}
