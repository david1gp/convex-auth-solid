import { mdiMagnify } from "@adaptive-ds/mdi/mdiMagnify.js"
import { debounce } from "@solid-primitives/scheduled"
import { onCleanup, onMount } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { debounceMs } from "#src/utils/ui/debounceMs.ts"
import { Input } from "#ui/input/input/Input.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { SignalObject } from "#ui/utils/createSignalObject.ts"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveId } from "#ui/utils/MayHaveId.ts"
import { generateId12 } from "#utils/ran/generateId12.js"

export interface ResourceListSearchProps extends MayHaveId, MayHaveClass, MayHaveChildren {
  searchSignal: SignalObject<string>
  searchState?: object
  debounceMs?: number
  placeholder?: string
}

const searchKey = "search"

export function SearchInput(p: ResourceListSearchProps) {
  onMount(() => {
    if (p.searchState) return
    loadSearchFromUrl()
    window.addEventListener("popstate", loadSearchFromUrl)
  })

  onCleanup(() => {
    if (!p.searchState && typeof window !== "undefined") window.removeEventListener("popstate", loadSearchFromUrl)
  })

  const debouncedSearch = debounce(() => {
    if (p.searchState) return
    const currentUrl = new URL(window.location.href)
    const search = p.searchSignal.get()
    if (search) {
      currentUrl.searchParams.set(searchKey, search)
    } else {
      currentUrl.searchParams.delete(searchKey)
    }
    window.history.replaceState(null, "", currentUrl.href)
  }, p.debounceMs ?? debounceMs)

  function loadSearchFromUrl() {
    const currentUrl = new URL(window.location.href)
    const search = currentUrl.searchParams.get(searchKey)
    p.searchSignal.set(search ?? "")
  }

  function handleInputChange(value: string) {
    p.searchSignal.set(value)
    if (!p.searchState) debouncedSearch()
  }

  const id = p.id ?? generateId12()

  return (
    <div class={classArr("relative", p.class)}>
      <div class={"absolute top-2 left-1 flex items-center pl-0.5 pointer-events-none"}>
        <Icon path={mdiMagnify} class={"size-6 fill-gray-500 dark:fill-gray-400"} />
      </div>
      <Input
        id={id}
        placeholder={p.placeholder ?? ttc("Search...")}
        value={p.searchSignal.get()}
        onInput={(e) => handleInputChange(e.currentTarget.value)}
        type="text"
        class={classArr("pl-8", p.searchSignal.get().length > 0 && "bg-yellow-100 dark:bg-yellow-800")}
      />
      {p.children}
    </div>
  )
}
