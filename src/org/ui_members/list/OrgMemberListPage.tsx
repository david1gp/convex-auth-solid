import { NavAppDir } from "@/app/nav/NavAppDir"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrgMember } from "@/org/convex/IdOrg"
import type { HasOrgHandle } from "@/org/model/HasOrgHandle"
import { urlOrgMemberAdd, urlOrgMemberView } from "@/org/url_member/urlOrgMember"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { mdiPlus } from "@mdi/js"
import { useParams } from "@solidjs/router"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"
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
          <NavAppDir getPageTitle={getPageTitle} orgHandle={getOrgHandle()} />
          <OrgMemberListLoader orgHandle={getOrgHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  const name = orgName ?? ttt("Organization")
  return name + ttt(" Members")
}

type OrgMember = DocOrgMember

type FetchOrgMembers = Accessor<Result<OrgMember[]> | undefined>

interface OrgMemberListLoaderProps extends HasOrgHandle {}

function OrgMemberListLoader(p: OrgMemberListLoaderProps) {
  const getOrgMembersResult: FetchOrgMembers = createQuery(api.org.orgMembersListQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  createEffect(() => {
    const orgMembersResult = getOrgMembersResult()
    if (!orgMembersResult) return
    if (!orgMembersResult.success) return
    // orgMemberListSignal.set(orgMembersResult.data)
  })

  return (
    <section id="org-members" class="p-6">
      <div class="flex flex-wrap items-center gap-4">
        <h1 class="text-2xl font-bold">{ttt("Organization Members")}</h1>
        <OrgMemberCreateLink orgHandle={p.orgHandle} />
      </div>

      <p class="text-lg mb-4">{ttt("Manage members of this organization")}</p>

      <Switch fallback={<p>Fallback content</p>}>
        <Match when={getOrgMembersResult() === undefined}>
          <OrgMemberLoading />
        </Match>
        <Match when={!hasOrgMembers(getOrgMembersResult())}>
          <OrgMemberEmpty orgHandle={p.orgHandle} />
        </Match>
        <Match when={true}>
          <OrgMemberList orgHandle={p.orgHandle} getOrgMembers={getOrgMembers(getOrgMembersResult())} />
        </Match>
      </Switch>
    </section>
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
  return <h2>{ttt("Loading...")}</h2>
}

function OrgMemberEmpty(p: HasOrgHandle) {
  return (
    <div>
      <h2>{ttt("Empty...")}</h2>
      <OrgMemberCreateLink orgHandle={p.orgHandle} />
    </div>
  )
}

interface OrgMemberLinkProps extends HasOrgHandle {
  member: OrgMember
}

function OrgMemberLink(p: OrgMemberLinkProps) {
  return <LinkButton href={urlOrgMemberView(p.orgHandle, p.member._id)}>{p.member.userId}</LinkButton>
}

function OrgMemberCreateLink(p: HasOrgHandle) {
  return (
    <LinkButton icon={mdiPlus} href={urlOrgMemberAdd(p.orgHandle)} variant={buttonVariant.success}>
      {ttt("Add Member")}
    </LinkButton>
  )
}
