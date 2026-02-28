import { debounceMs } from "@/utils/ui/debounceMs"
import { createSignalObject } from "~ui/utils/createSignalObject"
import { debounce } from "@solid-primitives/scheduled"
import { onMount } from "solid-js"

export interface FilterSignal<T = Record<string, string>> {
  get: () => T
  set: (value: T) => void
  update: (updates: Partial<T>) => void
  clear: () => void
  hasActiveFilters: () => boolean
}

export function createFilterSignal<T extends Record<string, string>>(defaultValue: T): FilterSignal<T> {
  const signal = createSignalObject<T>(defaultValue)
  let url: URL | null = null

  onMount(() => {
    url = new URL(window.location.href)
    loadFiltersFromUrl()
  })

  function loadFiltersFromUrl() {
    if (!url) return
    const filters: Partial<T> = {}

    Object.keys(defaultValue).forEach((key) => {
      const value = url!.searchParams.get(key)
      if (value !== null) {
        filters[key as keyof T] = value as T[keyof T]
      }
    })

    if (Object.keys(filters).length > 0) {
      signal.set({ ...defaultValue, ...filters })
    }
  }

  const debouncedUrlUpdate = debounce(() => {
    if (!url) url = new URL(window.location.href)
    const currentFilters = signal.get()

    // Clear all filter params
    Object.keys(defaultValue).forEach((key) => {
      url!.searchParams.delete(key)
    })

    // Set active filter params
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== defaultValue[key as keyof T]) {
        url!.searchParams.set(key, value)
      }
    })

    window.history.replaceState(null, "", url.href)
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
