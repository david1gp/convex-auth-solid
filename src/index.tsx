/* @refresh reload */

import { getRoutesAuth } from "@/auth/ui/getRoutesAuth"
import { getRoutesApp } from "@/getRoutesApp"
import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"
import "./global.css"

const routesApp = [
  {
    // path: "/*",
    component: LayoutWrapperApp,
    children: getRoutesApp(),
  },
]

const allRoutes = [...getRoutesAuth(), ...routesApp]

const root = document.getElementById("root")
render(() => <Router>{allRoutes}</Router>, root!)
