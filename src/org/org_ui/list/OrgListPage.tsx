import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { createEffect, For, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { orgSchema } from "#src/org/org_model/orgSchema.ts"
import { orgNameAddList } from "#src/org/org_ui/orgNameRecordSignal.ts"
import { urlOrgAdd, urlOrgView } from "#src/org/org_url/urlOrg.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

export function OrgListPage() {
  return (
    <PageWrapper>
      <NavOrg getOrgPageTitle={getPageTitle} />
      <OrgListLoader />
    </PageWrapper>
  )
}

function getPageTitle(_orgName?: string) {
  return ttc("Organizations")
}

type Org = OrgModel

function OrgListLoader() {
  const pagination = cursorPaginationCreate({
    query: api.org.orgListQuery,
    queryKey: "orgListQuery",
    args: () => ({ token: userTokenGet() }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    itemSchema: orgSchema,
  })
  createEffect(() => {
    const r = pagination.page()
    if (!r) return
    if (!r.success) return
    orgNameAddList(r.data.page)
  })

  return (
    <>
      <PageHeader title={ttc("Organizations")} class="mb-4">
        <OrgCreateLink />
      </PageHeader>

      <Switch>
        <Match when={pagination.page() === undefined}>
          <OrgsLoading />
        </Match>
        <Match when={resultHasErrorMessage(pagination.page())}>
          {(errorMessage) => <ErrorPage title={errorMessage()} />}
        </Match>
        <Match when={resultHasNoOrgs(pagination.page())}>
          <NoOrgs />
        </Match>
        <Match when={getOrgsPage(pagination.page())}>
          {(getPage) => <OrgList orgs={getPage().page} pagination={pagination} />}
        </Match>
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

interface OrgListProps {
  orgs: Org[]
  pagination: ReturnType<typeof cursorPaginationCreate<typeof api.org.orgListQuery, Org>>
}

function OrgList(p: OrgListProps) {
  return (
    <>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={p.orgs}>{(o) => <OrgLink org={o} />}</For>
      </div>
      <PaginationControls
        page={() => p.pagination.history().length + 1}
        canPrevious={p.pagination.canPrevious}
        canNext={p.pagination.canNext}
        previous={p.pagination.previous}
        next={p.pagination.next}
        loading={p.pagination.loading}
      />
    </>
  )
}

function getOrgsPage(orgsResult: Result<PaginationResultType<Org>> | undefined): PaginationResultType<Org> | null {
  if (!orgsResult?.success) return null
  return orgsResult.data
}

function resultHasNoOrgs(orgsResult: Result<PaginationResultType<Org>> | undefined): boolean {
  const page = getOrgsPage(orgsResult)
  return page !== null && page.page.length <= 0
}

function OrgLink(p: { org: Org }) {
  return <LinkButtonInternal to={urlOrgView(p.org.orgHandle)}>{p.org.name}</LinkButtonInternal>
}

function OrgCreateLink() {
  return (
    <LinkButtonInternal icon={mdiPlus} to={urlOrgAdd()} variant={buttonVariant.filledGreen}>
      {ttc("Create Organization")}
    </LinkButtonInternal>
  )
}
