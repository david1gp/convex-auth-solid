import { onMount, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"

export function useSearchParamsNative<T extends Record<string, any> = Record<string, string>>(): [
  Partial<T>,
  (params: Partial<T> | ((prev: Partial<T>) => Partial<T>), options?: { replace?: boolean }) => void,
] {
  const [searchParams, setSearchParams] = createStore<Partial<T>>({})

  const updateFromUrl = () => {
    const url = new URL(window.location.href)
    const params: Partial<T> = {}
    for (const [key, value] of url.searchParams) {
      params[key as keyof T] = value as any
    }
    setSearchParams(params)
  }

  onMount(() => {
    updateFromUrl()
    const handler = () => updateFromUrl()
    window.addEventListener("popstate", handler)
    onCleanup(() => window.removeEventListener("popstate", handler))
  })

  const setParams = (params: Partial<T> | ((prev: Partial<T>) => Partial<T>), options?: { replace?: boolean }) => {
    const current = { ...searchParams }
    const newParams = typeof params === "function" ? params(current) : { ...current, ...params }
    // Remove undefined, null, ''
    Object.keys(newParams).forEach((key) => {
      if (
        newParams[key as keyof T] === undefined ||
        newParams[key as keyof T] === null ||
        newParams[key as keyof T] === ""
      ) {
        delete newParams[key as keyof T]
      }
    })
    const url = new URL(window.location.href)
    url.search = new URLSearchParams(newParams as any).toString()
    if (options?.replace) {
      window.history.replaceState(null, "", url.href)
    } else {
      window.history.pushState(null, "", url.href)
    }
    setSearchParams(newParams)
  }

  return [searchParams, setParams]
}
