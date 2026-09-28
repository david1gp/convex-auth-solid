import { pageRouteInventory } from "#src/app/demos/pageRouteInventory.ts"

export function pageDemoRoutePathsCreate(): string[] {
  return pageRouteInventory.map(({ route }) => `/demos${route === "/" ? "/root" : route}`)
}
