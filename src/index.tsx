/* @refresh reload */

import { RouterProvider } from "@tanstack/solid-router"
import { render } from "solid-js/web"
import { demoList } from "#src/app/demos/demoList.ts"
import { getRoutesApp } from "#src/app/getRoutesApp.tsx"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import { NavDemo } from "#src/app/nav/NavDemo.tsx"
import { posthogInit } from "#src/app/posthog/posthog.ts"
import { buildRouter } from "#src/app/router/buildRouter.tsx"
import { getRoutesAuth } from "#src/auth/ui/getRoutesAuth.tsx"
import { getRoutesOrgInvitation } from "#src/org/invitation_url/getRoutesOrgInvitation.ts"
import { getRoutesOrgMember } from "#src/org/member_url/getRoutesOrgMember.ts"
import { getRoutesOrg } from "#src/org/org_url/getRoutesOrg.ts"
import { getRoutesWorkspaceInvitation } from "#src/workspace/invitation_url/getRoutesWorkspaceInvitation.ts"
import { getRoutesWorkspaceMember } from "#src/workspace/member_url/getRoutesWorkspaceMember.ts"
import { getRoutesWorkspace } from "#src/workspace/workspace_url/getRoutesWorkspace.ts"
import { generateDemoRoutes } from "#ui/demo_pages/generateDemoRoutes.tsx"
import { LayoutWrapperDemo } from "#ui/static/layout/LayoutWrapperDemo.tsx"
import "./tailwind.css"

posthogInit()

const routesApp = [
  {
    component: LayoutWrapperApp,
    children: [
      ...getRoutesApp(),
      ...getRoutesOrg(),
      ...getRoutesOrgMember(),
      ...getRoutesOrgInvitation(),
      ...getRoutesWorkspace(),
      ...getRoutesWorkspaceMember(),
      ...getRoutesWorkspaceInvitation(),
    ],
  },
]

const routesDemo = [
  {
    component: LayoutWrapperDemo,
    children: generateDemoRoutes(demoList, "/demos", NavDemo),
  },
]

const allRoutes = [...getRoutesAuth(), ...routesApp, ...routesDemo]

const router = buildRouter(allRoutes)

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById("root")
render(() => <RouterProvider router={router} />, root!)
