import type { Result, ResultOk } from "#result"
import { ttc } from "#src/app/i18n/ttc.js"
import { NavOrg } from "#src/app/nav/NavOrg.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { orgSchema } from "#src/org/org_model/orgSchema.js"
import { orgNameAddList } from "#src/org/org_ui/orgNameRecordSignal.js"
import { urlOrgAdd, urlOrgView } from "#src/org/org_url/urlOrg.js"
import { PageHeader } from "#src/ui/header/PageHeader.js"
import { NoData } from "#src/ui/illustrations/NoData.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { LoadingSection } from "#src/ui/pages/LoadingSection.js"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.js"
import { resultHasList } from "#src/utils/result/resultHasList.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva"
import { LinkButton } from "#ui/interactive/link/LinkButton"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren"
import { api } from "@convex/_generated/api.js"
import { mdiPlus } from "@mdi/js"
import { createEffect, For, Match, Switch, type Accessor } from "solid-js"
import * as a from "valibot"

export function OrgListPage() {
  return (
    <PageWrapper>
      <NavOrg getOrgPageTitle={getPageTitle}></NavOrg>
      <OrgListLoader />
    </PageWrapper>
  )
}

function getPageTitle(orgName?: string) {
  return ttc("Organizations")
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
      <PageHeader title={ttc("Organizations")} class="mb-4">
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
  return <LoadingSection loadingSubject={ttc("Organizations")} />
}

function NoOrgs(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Organizations")} class={p.class}>
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
    <LinkButton icon={mdiPlus} href={urlOrgAdd()} variant={buttonVariant.filledGreen}>
      {ttc("Create Organization")}
    </LinkButton>
  )
}
