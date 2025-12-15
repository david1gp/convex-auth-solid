/* @refresh reload */

import { getRoutesApp } from "@/app/getRoutesApp"
import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import { NavDemo } from "@/app/nav/NavDemo"
import { getRoutesAuth } from "@/auth/ui/getRoutesAuth"
import { getRoutesOrgInvitation } from "@/org/invitation_url/getRoutesOrgInvitation"
import { getRoutesOrgMember } from "@/org/member_url/getRoutesOrgMember"
import { getRoutesOrg } from "@/org/org_url/getRoutesOrg"
import { demoList } from "@/ui/demos/demoList"
import { getRoutesWorkspace } from "@/workspace/url/getRoutesWorkspace"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"
import { generateDemoRoutes } from "~ui/demo_pages/generateDemoRoutes"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import "./tailwind.css"

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
