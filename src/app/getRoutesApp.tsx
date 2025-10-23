import { NavApp } from "@/auth/ui/nav/NavApp"
import { lazy } from "solid-js"
import { PageWrapper2 } from "~ui/static/page/PageWrapper2"
import type { RouteObject } from "~ui/utils/RouteConfig"

const DemoAuthLinks = lazy(() => import("@/auth/ui/DemoAuthLinks").then((c) => ({ default: c.DemoAuthLinks })))

export function getRoutesApp(): RouteObject[] {
  return [
    {
      path: "/",
      component: HomePage,
    },
    {
      path: "/overview",
      component: Overview,
    },
    {
      path: "/demos",
      component: () => <DemoAuthLinks />,
    },
  ]
}

function HomePage() {
  return (
    <PageWrapper2>
      <NavApp />
      <div class="py-20">
        <h1 class="text-4xl font-bold">Home</h1>
        <p>this is a private page seen only to logged in users</p>
      </div>
      <div>
        <h2>auth links</h2>
        <DemoAuthLinks />
      </div>
    </PageWrapper2>
  )
}

function Overview() {
  return (
    <PageWrapper2>
      <NavApp />
      <div class="py-20">
        <h1 class="text-4xl font-bold">Overview</h1>
        <p>this is a private page seen only to logged in users</p>
      </div>
      <div>
        <h2>auth links</h2>
        <DemoAuthLinks />
      </div>
    </PageWrapper2>
  )
}
