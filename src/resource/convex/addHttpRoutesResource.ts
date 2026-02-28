import { addRouteWithCors } from "@/auth/convex/headers/cors/addRouteWithCors"
import { httpMethod } from "@/auth/convex/headers/httpMethod"
import { apiPathResourceGet, resourceGetRequestHandler } from "@/resource/convex/resourceFilesGetHttpHandler"
import {
  apiBaseResource,
  apiPathResourceList,
  resourceListHttpHandler,
} from "@/resource/convex/resourceListHttpHandler"
import type { HttpRouter } from "convex/server"

export function addHttpRoutesResource(http: HttpRouter) {
  addRouteWithCors(http, apiBaseResource + apiPathResourceList, httpMethod.GET, resourceListHttpHandler)
  addRouteWithCors(http, apiBaseResource + apiPathResourceGet, httpMethod.GET, resourceGetRequestHandler)
  return http
}
