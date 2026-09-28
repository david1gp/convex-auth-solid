import { createMemo } from "solid-js"
import { api } from "#convex/_generated/api.js"
import type { Language } from "#src/app/i18n/language.ts"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { resourceSchema } from "#src/resource/model/resourceSchema.ts"
import { type ResourceFilterState, resourceFilterCreate } from "#src/resource/model_field/resourceFilterFields.ts"
import type { ResourceType } from "#src/resource/model_field/resourceType.ts"
import type { Visibility } from "#src/resource/model_field/visibility.ts"
import { searchFilterStateCreate } from "#src/ui/input/search/searchFilterStateCreate.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"

export function resourceListLoaderStateCreate(demo: () => { resources: () => ResourceModel[] } | undefined) {
  const searchState = searchFilterStateCreate<ResourceFilterState>(resourceFilterCreate())
  const demoResources = createMemo(() => {
    const search = searchState.debouncedSearch().toLowerCase()
    const filters = searchState.debouncedFilters()
    return (demo()?.resources() ?? []).filter(
      (r) =>
        (!search || `${r.name ?? ""} ${r.description ?? ""}`.toLowerCase().includes(search)) &&
        (!filters.type || r.type === filters.type) &&
        (!filters.visibility || r.visibility === filters.visibility) &&
        (!filters.language || r.language === filters.language),
    )
  })
  const getResourceFilters = () => {
    const filters = searchState.debouncedFilters()
    return {
      searchText: searchState.debouncedSearch() || undefined,
      type: (filters.type || undefined) as ResourceType | undefined,
      visibility: (filters.visibility || undefined) as Visibility | undefined,
      l: (filters.language || undefined) as Language | undefined,
    }
  }
  const pagination = demo()
    ? undefined
    : cursorPaginationCreate({
        query: api.resource.resourcesListQuery,
        queryKey: "resourcesListQuery",
        args: () => ({ token: userTokenGet(), ...getResourceFilters() }),
        identity: () => userSessionSignal.get()?.profile.userId ?? null,
        filters: getResourceFilters,
        itemSchema: resourceSchema,
      })
  return { searchState, demoResources, pagination }
}
