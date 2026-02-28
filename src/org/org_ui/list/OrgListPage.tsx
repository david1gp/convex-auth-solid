import { ttc } from "@/app/i18n/ttc"
import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { orgSchema } from "@/org/org_model/orgSchema"
import { orgNameAddList } from "@/org/org_ui/orgNameRecordSignal"
import { urlOrgAdd, urlOrgView } from "@/org/org_url/urlOrg"
import { PageHeader } from "@/ui/header/PageHeader"
import { NoData } from "@/ui/illustrations/NoData"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { resultHasList } from "@/utils/result/resultHasList"
import { api } from "@convex/_generated/api"
import { mdiPlus } from "@mdi/js"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import * as a from "valibot"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"
import type { Result, ResultOk } from "~utils/result/Result"

export function OrgListPage() {
  return (
    <PageWrapper>
      <NavOrg getOrgPageTitle={getPageTitle}></NavOrg>
      <OrgListLoader />
    </PageWrapper>
  )
}

function getPageTitle(orgName?: string) {
  return ttc("Stakeholders")
}

type Org = OrgModel

type FetchOrgs = Accessor<Result<Org[]> | undefined>

function OrgListLoader() {
  // console.log("OrgList.getSession", p.getSession())
  const getOrgsQuery: FetchOrgs = createQuery(api.org.orgListQuery, {
    token: userTokenGet(),
  })
  const getOrgsResult = createQueryCached<Org[]>(getOrgsQuery, "orgListQuery", a.array(orgSchema))
  createEffect(() => {
    const r = getOrgsResult()
    if (!r) return
    if (!r.success) return
    orgNameAddList(r.data)
  })

  return (
    <>
      <PageHeader title={ttc("Stakeholders")} class="mb-4">
        <OrgCreateLink />
      </PageHeader>

      <Switch>
        <Match when={getOrgsResult() === undefined}>
          <OrgsLoading />
        </Match>
        <Match when={resultHasErrorMessage(getOrgsResult())}>
          {(errorMessage) => <ErrorPage title={errorMessage()} />}
        </Match>
        <Match when={!resultHasList(getOrgsResult())}>
          <NoOrgs />
        </Match>
        <Match when={resultHasList(getOrgsResult())}>{(getList) => <OrgList orgs={getList()} />}</Match>
      </Switch>
    </>
  )
}

function OrgsLoading() {
  return <LoadingSection loadingSubject={ttc("Stakeholders")} />
}

function NoOrgs(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Stakeholders")} class={p.class}>
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
  orgs: Org[]
}

function OrgList(p: OrgListProps) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={p.orgs}>{(o) => <OrgLink org={o} />}</For>
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
  return <LinkButton href={urlOrgView(p.org.orgHandle)}>{p.org.name}</LinkButton>
}

function OrgCreateLink() {
  return (
    <LinkButton icon={mdiPlus} href={urlOrgAdd()} variant={buttonVariant.success}>
      {ttc("Create Stakeholder")}
    </LinkButton>
  )
}
