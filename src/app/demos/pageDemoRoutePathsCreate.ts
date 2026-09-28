import { pageRouteInventory } from "#src/app/demos/pageRouteInventory.ts"

export function pageDemoRoutePathsCreate(): string[] {
  return ["/demos/pages", ...pageRouteInventory.map(({ route }) => `/demos/pages${route === "/" ? "/root" : route}`)]
}
