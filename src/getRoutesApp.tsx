import { lazy } from "solid-js"
import type { RouteObject } from "~ui/utils/ui/RouteConfig"

const DemoAuthLinks = lazy(() => import("@/auth/ui/DemoAuthLinks").then((c) => ({ default: c.DemoAuthLinks })))

export function getRoutesApp(): RouteObject[] {
  return [
    {
      path: "/",
      component: () => <div class="text-4xl font-bold my-20">Home</div>,
    },
    {
      path: "/overview",
      component: () => <div class="text-4xl font-bold my-20">Overview</div>,
    },
    {
      path: "/demos",
      component: () => <DemoAuthLinks />,
    },
  ]
}
