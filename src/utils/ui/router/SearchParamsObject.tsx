import type { NavigateOptions } from "@solidjs/router"
import type { SearchParams, SetSearchParams } from "node_modules/@solidjs/router/dist/types"

export type SearchParamsObject = {
  get: Partial<SearchParams>
  set: (params: SetSearchParams, options?: Partial<NavigateOptions>) => void
}
