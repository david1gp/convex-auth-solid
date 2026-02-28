import { ttc } from "@/app/i18n/ttc"
import { debounceMs } from "@/utils/ui/debounceMs"
import { mdiMagnify } from "@mdi/js"
import { debounce } from "@solid-primitives/scheduled"
import { onMount } from "solid-js"
import { Input } from "~ui/input/input/Input"
import { Icon } from "~ui/static/icon/Icon"
import { classArr } from "~ui/utils/classArr"
import { type SignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveId } from "~ui/utils/MayHaveId"
import { generateId12 } from "~utils/ran/generateId12"

export interface ResourceListSearchProps extends MayHaveId, MayHaveClass, MayHaveChildren {
  searchSignal: SignalObject<string>
  placeholder?: string
}

const searchKey = "search"

export function SearchInput(p: ResourceListSearchProps) {
  let url: URL | null = null

  onMount(() => {
    url = new URL(window.location.href)
    const search = url.searchParams.get(searchKey)
    if (!search) return
    p.searchSignal.set(search)
  })

  const debouncedSearch = debounce((value: string) => {
    if (!url) url = new URL(window.location.href)
    const search = p.searchSignal.get()
    url.searchParams.set(searchKey, search)
    window.history.replaceState(null, "", url.href)
  }, debounceMs)

  function handleInputChange(value: string) {
    p.searchSignal.set(value)
    debouncedSearch(value)
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
