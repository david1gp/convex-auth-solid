import { NavAppDir } from "@/app/nav/NavAppDir"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrg } from "@/org/convex/IdOrg"
import { orgListSignal } from "@/org/ui/list/orgListSignal"
import { urlOrgAdd, urlOrgView } from "@/org/url/urlOrg"
import { PageHeader } from "@/ui/header/PageHeader"
import { NoData } from "@/ui/illustrations/NoData"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { mdiPlus } from "@mdi/js"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { HasClassAndChildren } from "~ui/utils/HasClassAndChildren"
import type { Result, ResultOk } from "~utils/result/Result"

export function OrgListPage() {
  return (
    <PageWrapper>
      <NavAppDir getPageTitle={getPageTitle} />
      <OrgListLoader />
    </PageWrapper>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return ttt("Organizations")
}

type Org = DocOrg

type FetchOrgs = Accessor<Result<Org[]> | undefined>

function OrgListLoader() {
  // console.log("OrgList.getSession", p.getSession())
  const getOrgsResult: FetchOrgs = createQuery(api.org.orgsListQuery, {
    token: userTokenGet(),
  })
  createEffect(() => {
    const orgsResult = getOrgsResult()
    if (!orgsResult) return
    if (!orgsResult.success) return
    orgListSignal.set(orgsResult.data)
  })

  return (
    <>
      <PageHeader title={ttt("Organizations")} subtitle={ttt("Manage all Organizations")}>
        <OrgCreateLink />
      </PageHeader>

      <Switch>
        <Match when={getOrgsResult() === undefined}>
          <OrgsLoading />
        </Match>
        <Match when={!hasOrgs(getOrgsResult())}>
          <NoOrgs />
        </Match>
        <Match when={true}>
          <OrgList getOrgs={getOrgs(getOrgsResult())} />
        </Match>
      </Switch>
    </>
  )
}

function OrgsLoading() {
  return <LoadingSection loadingSubject={ttt("Organizations")} />
}

function NoOrgs(p: HasClassAndChildren) {
  return (
    <NoData noDataText={ttt("No Organizations")} class={p.class}>
      {p.children}
    </NoData>
  )
}

function getOrgs(orgsResult: Result<Org[]> | undefined): Accessor<Org[]> {
  return () => {
    return (orgsResult as ResultOk<Org[]>).data
  }
}

interface OrgListProps {
  getOrgs: Accessor<Org[]>
}

function OrgList(p: OrgListProps) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={p.getOrgs()}>{(o) => <OrgLink org={o} />}</For>
    </div>
  )
}

function hasOrgs(orgsResult: Result<Org[]> | undefined): Org[] | null {
  if (!orgsResult) return null
  if (!orgsResult.success) return null
  const orgs = orgsResult.data
  if (orgs.length <= 0) return null
  return orgs
}

function OrgLink(p: { org: Org }) {
  return <LinkButton href={urlOrgView(p.org._id)}>{p.org.name}</LinkButton>
}

function OrgCreateLink() {
  return (
    <LinkButton icon={mdiPlus} href={urlOrgAdd()} variant={buttonVariant.success}>
      {ttt("Create Organization")}
    </LinkButton>
  )
}
