import { useParams } from "@tanstack/solid-router"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { pageRouteInventory } from "#src/app/demos/pageRouteInventory.ts"

export function pageDemoBoundaryStateCreate(entry?: (typeof pageRouteInventory)[number]) {
  const routeParams = useParams({ strict: false })
  return {
    links: pageRouteInventory.map((item) => ({ title: item.title, route: item.route, href: pageDemoHref(item.route) })),
    paramEntries: () =>
      Object.keys(entry?.params ?? {}).map((key) => [key, (routeParams() as Record<string, string>)[key]] as const),
  }
}
