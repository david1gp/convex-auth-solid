import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { createEffect, For, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import type { Language } from "#src/app/i18n/language.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavResource } from "#src/app/nav/NavResource.tsx"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { resourceSchema } from "#src/resource/model/resourceSchema.ts"
import {
  type ResourceFilterState,
  resourceFilterCreate,
  resourceFilterFields,
} from "#src/resource/model_field/resourceFilterFields.ts"
import type { ResourceType } from "#src/resource/model_field/resourceType.ts"
import type { Visibility } from "#src/resource/model_field/visibility.ts"
import { resourceNameAddList } from "#src/resource/ui/resourceNameRecordSignal.ts"
import { ResourceCardLink } from "#src/resource/ui/shared/ResourceCardLink.tsx"
import { urlResourceAdd } from "#src/resource/url/urlResource.ts"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { SearchFilterButtons } from "#src/ui/input/search/SearchFilterButtons.tsx"
import { SearchFilterPopover } from "#src/ui/input/search/SearchFilterPopover.tsx"
import { SearchInput } from "#src/ui/input/search/SearchInput.tsx"
import { searchFilterStateCreate } from "#src/ui/input/search/searchFilterStateCreate.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { classesGridCols2xl } from "#ui/static/grid/classesGridCols.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

export function ResourceListPage() {
  return (
    <PageWrapper>
      <NavResource getResourcePageTitle={() => ttc("Resources")} />
      <ResourceListLoader />
    </PageWrapper>
  )
}

function ResourceListLoader() {
  const searchState = searchFilterStateCreate<ResourceFilterState>(resourceFilterCreate())
  const getResourceFilters = () => {
    const filters = searchState.debouncedFilters()
    return {
      searchText: searchState.debouncedSearch() || undefined,
      type: (filters.type || undefined) as ResourceType | undefined,
      visibility: (filters.visibility || undefined) as Visibility | undefined,
      l: (filters.language || undefined) as Language | undefined,
    }
  }
  const pagination = cursorPaginationCreate({
    query: api.resource.resourcesListQuery,
    queryKey: "resourcesListQuery",
    args: () => ({
      token: userTokenGet(),
      ...getResourceFilters(),
    }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    filters: getResourceFilters,
    itemSchema: resourceSchema,
  })

  return (
    <>
      <div class="flex flex-wrap gap-2 justify-between mb-4">
        <div class="flex flex-wrap gap-2 items-center">
          <SearchInput searchSignal={searchState.searchSignal} searchState={searchState} />
          <SearchFilterPopover filterSignal={searchState.filterSignal} filterFields={resourceFilterFields} />
          <SearchFilterButtons filterSignal={searchState.filterSignal} filterFields={resourceFilterFields} />
        </div>
        <ResourceCreateLink />
      </div>

      <Switch>
        <Match when={pagination.page() === undefined}>
          <LoadingSection loadingSubject={ttc("Resources")} />
        </Match>
        <Match when={resultHasErrorMessage(pagination.page())}>
          {(errorMessage) => <ErrorPage title={errorMessage()} />}
        </Match>
        <Match when={resultHasNoResources(pagination.page(), pagination.canPrevious())}>
          <NoResources />
        </Match>
        <Match when={getResourcesPage(pagination.page())}>
          {(getPage) => (
            <>
              <ResourceList resources={getPage().page} />
              <PaginationControls
                page={() => pagination.history().length + 1}
                canPrevious={pagination.canPrevious}
                canNext={pagination.canNext}
                previous={pagination.previous}
                next={pagination.next}
                loading={pagination.loading}
              />
            </>
          )}
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

function getResourcesPage(
  result: Result<PaginationResultType<ResourceModel>> | undefined,
): PaginationResultType<ResourceModel> | null {
  if (!result?.success) return null
  return result.data
}

function resultHasNoResources(
  result: Result<PaginationResultType<ResourceModel>> | undefined,
  canPrevious: boolean,
): boolean {
  const page = getResourcesPage(result)
  return page !== null && page.isDone && !canPrevious && page.page.length <= 0
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
    <LinkButtonInternal icon={mdiPlus} to={urlResourceAdd()} variant={buttonVariant.filledGreen}>
      {ttc("Create Resource")}
    </LinkButtonInternal>
  )
}
