import { PageDemoBoundary } from "#src/app/demos/PageDemoBoundary.tsx"
import { pageDemoRoutePathsCreate } from "#src/app/demos/pageDemoRoutePathsCreate.ts"
import { pageRouteInventory } from "#src/app/demos/pageRouteInventory.ts"
import type { RouteObject } from "#ui/demo_pages/RouteConfig.ts"

/** Dedicated routes, independent of the scanner-owned component demoList. */
export function pageDemoRoutesCreate(): RouteObject[] {
  const [catalogPath, ...detailPaths] = pageDemoRoutePathsCreate()
  return [
    { path: catalogPath!, component: PageDemoBoundary },
    ...pageRouteInventory.map((entry, index) => ({
      path: detailPaths[index]!,
      component: () => <PageDemoBoundary entry={entry} />,
    })),
  ]
}
