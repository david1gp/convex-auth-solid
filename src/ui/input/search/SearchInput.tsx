import { mdiMagnify } from "@adaptive-ds/mdi/mdiMagnify.js"
import type { SearchInputProps } from "#src/ui/input/search/SearchInputProps.ts"
import { searchInputStateCreate } from "#src/ui/input/search/SearchInputStateCreate.ts"
import { Input } from "#ui/input/input/Input.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classArr } from "#ui/utils/classArr.ts"

export function SearchInput(p: SearchInputProps) {
  const state = searchInputStateCreate(() => p)

  return (
    <div class={classArr("relative", p.class)}>
      <div class={"absolute top-2 left-1 flex items-center pl-0.5 pointer-events-none"}>
        <Icon path={mdiMagnify} class={"size-6 fill-gray-500 dark:fill-gray-400"} />
      </div>
      <Input
        id={state.id()}
        placeholder={state.placeholder()}
        value={state.searchValue()}
        onInput={state.handleInput}
        type="text"
        class={classArr("pl-8", state.hasSearch() && "bg-yellow-100 dark:bg-yellow-800")}
      />
      {p.children}
    </div>
  )
}
