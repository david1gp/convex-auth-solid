import { urlOverview } from "@/app/pages/urlOverview"
import { urlTodo } from "@/app/pages/urlTodo"
import { lazy } from "solid-js"
import type { RouteObject } from "~ui/utils/RouteConfig"

export const OverviewPage = lazy(() => import("@/app/pages/OverviewPage").then((c) => ({ default: c.OverviewPage })))
export const TodoPage = lazy(() => import("@/ui/pages/TodoPage").then((c) => ({ default: c.TodoPage })))
export const LoadingPage = lazy(() => import("@/ui/pages/LoadingPage").then((c) => ({ default: c.LoadingPage })))
export const DemoLoaders = lazy(() => import("@/ui/loaders/DemoLoaders").then((c) => ({ default: c.DemoLoaders })))

export const DemoAuthLinks = lazy(() => import("@/auth/ui/DemoAuthLinks").then((c) => ({ default: c.DemoAuthLinks })))

export function getRoutesApp(): RouteObject[] {
  return [
    {
      path: "/",
      component: OverviewPage,
    },
    {
      path: urlOverview(),
      component: OverviewPage,
    },
    {
      path: "/demo/auth",
      component: () => <DemoAuthLinks />,
    },
    {
      path: urlTodo(),
      component: () => <TodoPage />,
    },
    {
      path: "/demo/loading",
      component: () => <LoadingPage />,
    },
    {
      path: "/demo/loaders",
      component: () => <DemoLoaders />,
    },
  ]
}
