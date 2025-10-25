import type { SearchParamsObject } from "@/utils/ui/router/SearchParamsObject"
import { useSearchParams } from "@solidjs/router"

export function useSearchParamsObject(): SearchParamsObject {
  const [searchParams, setSearchParams] = useSearchParams()
  return { get: searchParams, set: setSearchParams }
}
