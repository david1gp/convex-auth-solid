/* @refresh reload */

import { getRoutesApp } from "@/app/getRoutesApp"
import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import { getRoutesAuth } from "@/auth/ui/getRoutesAuth"
import { getRoutesOrg } from "@/org/org_url/getRoutesOrg"
import { getRoutesWorkspace } from "@/workspace/url/getRoutesWorkspace"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"
import "./global.css"

const routesApp = [
  {
    component: LayoutWrapperApp,
    children: [...getRoutesApp(), ...getRoutesOrg(), ...getRoutesWorkspace()],
  },
]

const allRoutes = [...getRoutesAuth(), ...routesApp]

const root = document.getElementById("root")
render(() => <Router>{allRoutes}</Router>, root!)
