import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavResource } from "#src/app/nav/NavResource.tsx"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { resourceSchema } from "#src/resource/model/resourceSchema.ts"
import {
    resourceFilter,
    resourceFilterCreate,
    resourceFilterFields,
    type ResourceFilterState,
} from "#src/resource/model_field/resourceFilterFields.ts"
import { resourceNameAddList } from "#src/resource/ui/resourceNameRecordSignal.ts"
import { ResourceCardLink } from "#src/resource/ui/shared/ResourceCardLink.tsx"
import { urlResourceAdd } from "#src/resource/url/urlResource.ts"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { createFilterSignal } from "#src/ui/input/search/filterSignal.ts"
import { SearchFilterButtons } from "#src/ui/input/search/SearchFilterButtons.tsx"
import { SearchFilterPopover } from "#src/ui/input/search/SearchFilterPopover.tsx"
import { SearchInput } from "#src/ui/input/search/SearchInput.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import { resultHasList } from "#src/utils/result/resultHasList.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classesGridCols2xl } from "#ui/static/grid/classesGridCols.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"
import { mdiPlus } from "@mdi/js"
import { createEffect, For, Match, Switch } from "solid-js"
import * as a from "valibot"

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
    <LinkButton icon={mdiPlus} href={urlResourceAdd()} variant={buttonVariant.filledGreen}>
      {ttc("Create Resource")}
    </LinkButton>
  )
}
