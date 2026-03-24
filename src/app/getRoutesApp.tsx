import { urlOverview } from "#src/app/pages/urlOverview.js"
import { urlTodo } from "#src/app/pages/urlTodo.js"
import type { RouteObject } from "#ui/utils/RouteConfig.js"
import { lazy } from "solid-js"

export const OverviewPage = lazy(() => import("#src/app/pages/OverviewPage.jsx").then((c) => ({ default: c.OverviewPage })))
export const TodoPage = lazy(() => import("#src/ui/pages/TodoPage.jsx").then((c) => ({ default: c.TodoPage })))
export const LoadingPage = lazy(() => import("#src/ui/pages/LoadingPage.jsx").then((c) => ({ default: c.LoadingPage })))
export const DemoLoaders = lazy(() => import("#src/ui/loaders/DemoLoaders.jsx").then((c) => ({ default: c.DemoLoaders })))

export const DemoAuthLinks = lazy(() => import("#src/auth/ui/DemoAuthLinks.jsx").then((c) => ({ default: c.DemoAuthLinks })))

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
