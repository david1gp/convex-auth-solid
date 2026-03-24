import { addRouteWithCors } from "#src/auth/convex/headers/cors/addRouteWithCors.js"
import { httpMethod } from "#src/auth/convex/headers/httpMethod.js"
import { apiPathResourceGet, resourceGetRequestHandler } from "#src/resource/convex/resourceFilesGetHttpHandler.js"
import {
    apiBaseResource,
    apiPathResourceList,
    resourceListHttpHandler,
} from "#src/resource/convex/resourceListHttpHandler.js"
import type { HttpRouter } from "convex/server"

export function addHttpRoutesResource(http: HttpRouter) {
  addRouteWithCors(http, apiBaseResource + apiPathResourceList, httpMethod.GET, resourceListHttpHandler)
  addRouteWithCors(http, apiBaseResource + apiPathResourceGet, httpMethod.GET, resourceGetRequestHandler)
  return http
}
