import { lazy } from "solid-js"
import type { RouteObject } from "~ui/utils/ui/RouteConfig"

const DemoAuthLinks = lazy(() => import("@/auth/DemoAuthLinks").then((c) => ({ default: c.DemoAuthLinks })))

export function getRoutesApp(): RouteObject[] {
  return [
    {
      path: "/",
      component: () => <div>Home</div>,
    },
    {
      path: "/overview",
      component: () => <div>Overview</div>,
    },
    {
      path: "/demos",
      component: () => <DemoAuthLinks />,
    },
  ]
}
