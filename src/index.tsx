/* @refresh reload */

import { getRoutesApp } from "#src/app/getRoutesApp.jsx"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.jsx"
import { NavDemo } from "#src/app/nav/NavDemo.jsx"
import { posthogInit } from "#src/app/posthog/posthog.js"
import { getRoutesAuth } from "#src/auth/ui/getRoutesAuth.jsx"
import { getRoutesOrgInvitation } from "#src/org/invitation_url/getRoutesOrgInvitation.js"
import { getRoutesOrgMember } from "#src/org/member_url/getRoutesOrgMember.js"
import { getRoutesOrg } from "#src/org/org_url/getRoutesOrg.js"
import { demoList } from "#src/ui/demos/demoList.js"
import { getRoutesWorkspace } from "#src/workspace/url/getRoutesWorkspace.js"
import { generateDemoRoutes } from "#ui/demo_pages/generateDemoRoutes.jsx"
import { LayoutWrapperDemo } from "#ui/static/layout/LayoutWrapperDemo.jsx"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"
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

const root = document.getElementById("root")
render(() => <Router>{allRoutes}</Router>, root!)
