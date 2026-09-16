import { debounce } from "@solid-primitives/scheduled"
import { onCleanup, onMount } from "solid-js"
import { debounceMs } from "#src/utils/ui/debounceMs.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export interface FilterSignal<T = Record<string, string>> {
  get: () => T
  set: (value: T) => void
  update: (updates: Partial<T>) => void
  clear: () => void
  hasActiveFilters: () => boolean
}

export function createFilterSignal<T extends Record<string, string>>(defaultValue: T): FilterSignal<T> {
  const signal = createSignalObject<T>(defaultValue)
  onMount(() => {
    loadFiltersFromUrl()
    window.addEventListener("popstate", loadFiltersFromUrl)
  })

  onCleanup(() => {
    debouncedUrlUpdate.clear()
    if (typeof window !== "undefined") window.removeEventListener("popstate", loadFiltersFromUrl)
  })

  function loadFiltersFromUrl() {
    debouncedUrlUpdate.clear()
    const url = new URL(window.location.href)
    signal.set(filterSignalValueFromUrl(defaultValue, url))
  }

  const debouncedUrlUpdate = debounce(() => {
    const currentUrl = new URL(window.location.href)
    const currentFilters = signal.get()

    // Clear all filter params
    Object.keys(defaultValue).forEach((key) => {
      currentUrl.searchParams.delete(key)
    })

    // Set active filter params
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== defaultValue[key as keyof T]) {
        currentUrl.searchParams.set(key, value)
      }
    })

    window.history.replaceState(null, "", currentUrl.href)
  }, debounceMs)

  return {
    get: signal.get,
    set: (value: T) => {
      signal.set(value)
      debouncedUrlUpdate()
    },
    update: (updates: Partial<T>) => {
      const current = signal.get()
      signal.set({ ...current, ...updates })
      debouncedUrlUpdate()
    },
    clear: () => {
      signal.set(defaultValue)
      debouncedUrlUpdate()
    },
    hasActiveFilters: () => {
      const current = signal.get()
      return Object.entries(current).some(([key, value]) => value !== defaultValue[key as keyof T])
    },
  }
}

export function filterSignalValueFromUrl<T extends Record<string, string>>(defaultValue: T, url: URL): T {
  const filters: Partial<T> = {}

  Object.keys(defaultValue).forEach((key) => {
    const value = url.searchParams.get(key)
    if (value !== null) {
      filters[key as keyof T] = value as T[keyof T]
    }
  })

  return { ...defaultValue, ...filters }
}
