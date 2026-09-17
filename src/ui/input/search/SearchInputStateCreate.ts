import { debounce } from "@solid-primitives/scheduled"
import { onCleanup, onMount } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import type { SearchInputProps } from "#src/ui/input/search/SearchInputProps.ts"
import { debounceMs } from "#src/utils/ui/debounceMs.ts"
import { generateId12 } from "#utils/ran/generateId12.js"

const searchKey = "search"

export function searchInputStateCreate(props: () => SearchInputProps) {
  const generatedId = generateId12()

  function loadSearchFromUrl() {
    const currentUrl = new URL(window.location.href)
    const search = currentUrl.searchParams.get(searchKey)
    props().searchSignal.set(search ?? "")
  }

  const debouncedSearch = debounce(() => {
    if (props().searchState) return
    const currentUrl = new URL(window.location.href)
    const search = props().searchSignal.get()
    if (search) {
      currentUrl.searchParams.set(searchKey, search)
    } else {
      currentUrl.searchParams.delete(searchKey)
    }
    window.history.replaceState(null, "", currentUrl.href)
  }, props().debounceMs ?? debounceMs)

  onMount(() => {
    if (props().searchState) return
    loadSearchFromUrl()
    window.addEventListener("popstate", loadSearchFromUrl)
  })

  onCleanup(() => {
    debouncedSearch.clear()
    if (!props().searchState && typeof window !== "undefined") window.removeEventListener("popstate", loadSearchFromUrl)
  })

  function handleInput(e: InputEvent) {
    const target = e.currentTarget as HTMLInputElement
    props().searchSignal.set(target.value)
    if (!props().searchState) debouncedSearch()
  }

  return {
    handleInput,
    hasSearch: () => props().searchSignal.get().length > 0,
    id: () => props().id ?? generatedId,
    placeholder: () => props().placeholder ?? ttc("Search..."),
    searchValue: props().searchSignal.get,
  }
}
