import { addRouteWithCors } from "#src/auth/convex/headers/cors/addRouteWithCors.ts"
import { httpMethod } from "#src/auth/convex/headers/httpMethod.ts"
import { apiPathResourceGet, resourceGetRequestHandler } from "#src/resource/convex/resourceFilesGetHttpHandler.ts"
import {
    apiBaseResource,
    apiPathResourceList,
    resourceListHttpHandler,
} from "#src/resource/convex/resourceListHttpHandler.ts"
import type { HttpRouter } from "convex/server"

export function addHttpRoutesResource(http: HttpRouter) {
  addRouteWithCors(http, apiBaseResource + apiPathResourceList, httpMethod.GET, resourceListHttpHandler)
  addRouteWithCors(http, apiBaseResource + apiPathResourceGet, httpMethod.GET, resourceGetRequestHandler)
  return http
}
