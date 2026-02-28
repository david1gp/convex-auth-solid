import { ttc } from "@/app/i18n/ttc"
import { NavResource } from "@/app/nav/NavResource"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { resourceSchema } from "@/resource/model/resourceSchema"
import {
  resourceFilter,
  resourceFilterCreate,
  resourceFilterFields,
  type ResourceFilterState,
} from "@/resource/model_field/resourceFilterFields"
import { resourceNameAddList } from "@/resource/ui/resourceNameRecordSignal"
import { ResourceCardLink } from "@/resource/ui/shared/ResourceCardLink"
import { urlResourceAdd } from "@/resource/url/urlResource"
import { NoData } from "@/ui/illustrations/NoData"
import { createFilterSignal } from "@/ui/input/search/filterSignal"
import { SearchFilterButtons } from "@/ui/input/search/SearchFilterButtons"
import { SearchFilterPopover } from "@/ui/input/search/SearchFilterPopover"
import { SearchInput } from "@/ui/input/search/SearchInput"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { resultHasList } from "@/utils/result/resultHasList"
import { api } from "@convex/_generated/api"
import { mdiPlus } from "@mdi/js"
import { createEffect, For, Match, Switch } from "solid-js"
import * as a from "valibot"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classesGridCols2xl } from "~ui/static/container/classesGridCols"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classArr } from "~ui/utils/classArr"
import { createSignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"

export function ResourceListPage() {
  return (
    <PageWrapper>
      <NavResource getResourcePageTitle={() => ttc("Resources")}></NavResource>
      <ResourceListLoader />
    </PageWrapper>
  )
}

function ResourceListLoader() {
  const getResourceQuery = createQuery(api.resource.resourcesListQuery, {
    token: userTokenGet(),
  })
  const getResourcesResult = createQueryCached<ResourceModel[]>(
    getResourceQuery,
    "resourcesListQuery",
    a.array(resourceSchema),
  )

  const searchSignal = createSignalObject("")
  const filterSignal = createFilterSignal<ResourceFilterState>(resourceFilterCreate())
  function filterResources(resources: ResourceModel[]): ResourceModel[] {
    const search = searchSignal.get()
    const filters = filterSignal.get()
    return resourceFilter(resources, search, filters)
  }

  return (
    <>
      <div class="flex flex-wrap gap-2 justify-between mb-4">
        <div class="flex flex-wrap gap-2 items-center">
          <SearchInput searchSignal={searchSignal} />
          <SearchFilterPopover filterSignal={filterSignal} filterFields={resourceFilterFields} />
          <SearchFilterButtons filterSignal={filterSignal} filterFields={resourceFilterFields} />
        </div>
        <ResourceCreateLink />
      </div>

      <Switch>
        <Match when={!getResourcesResult()}>
          <LoadingSection loadingSubject={ttc("Resources")} />
        </Match>
        <Match when={resultHasErrorMessage(getResourcesResult())}>
          {(errorMessage) => <ErrorPage title={errorMessage()} />}
        </Match>
        <Match when={!resultHasList(getResourcesResult())}>
          <NoResources />
        </Match>
        <Match when={resultHasList(getResourcesResult())}>
          {(getList) => <ResourceList resources={filterResources(getList())} />}
        </Match>
      </Switch>
    </>
  )
}

export function NoResources(p: MayHaveClassAndChildren) {
  return (
    <NoData noDataText={ttc("No Resources")} class={p.class}>
      {p.children}
    </NoData>
  )
}

interface ResourceListProps extends MayHaveClass {
  resources: ResourceModel[]
}

function ResourceList(p: ResourceListProps) {
  createEffect(() => {
    const got = p.resources
    if (!got) return
    if (got.length <= 0) return
    resourceNameAddList(got)
  })
  return (
    <div class={classArr(classesGridCols2xl, "gap-4")}>
      <For each={p.resources}>{(r) => <ResourceCardLink resource={r} />}</For>
    </div>
  )
}

function ResourceCreateLink() {
  return (
    <LinkButton icon={mdiPlus} href={urlResourceAdd()} variant={buttonVariant.success}>
      {ttc("Create Resource")}
    </LinkButton>
  )
}
