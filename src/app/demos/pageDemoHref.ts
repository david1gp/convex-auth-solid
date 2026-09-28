import { pageRouteInventory } from "#src/app/demos/pageRouteInventory.ts"

type PageRoute = (typeof pageRouteInventory)[number]["route"]
type PageParams<R extends PageRoute> = {
  [K in keyof Extract<(typeof pageRouteInventory)[number], { route: R }>["params"]]?: string
}

/** Always navigate within the isolated gallery, never to the corresponding live URL. */
export function pageDemoHref<R extends PageRoute>(route: R, params?: PageParams<R>): string {
  const entry = pageRouteInventory.find((item) => item.route === route)
  if (!entry) return "/demos/pages"
  if (route === "/") return "/demos/pages/root"

  const values: Record<string, string> = { ...entry.params, ...params }
  return `/demos/pages${route.replace(/:([^/]+)/g, (_, key: string) => encodeURIComponent(values[key] ?? ""))}`
}
