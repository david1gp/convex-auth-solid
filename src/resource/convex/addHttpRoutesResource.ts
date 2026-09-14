import { addRouteWithCors } from "#src/auth/convex/headers/cors/addRouteWithCors.ts"
import type { HonoDispatcher } from "#src/auth/convex/headers/honoDispatcher.ts"
import { httpMethod } from "#src/auth/convex/headers/httpMethod.ts"
import { apiPathResourceGet, resourceGetRequestHandler } from "#src/resource/convex/resourceFilesGetHttpHandler.ts"
import {
  apiBaseResource,
  apiPathResourceList,
  resourceListHttpHandler,
} from "#src/resource/convex/resourceListHttpHandler.ts"

export function addHttpRoutesResource(dispatcher: HonoDispatcher) {
  addRouteWithCors(dispatcher, apiBaseResource + apiPathResourceList, httpMethod.GET, resourceListHttpHandler)
  addRouteWithCors(dispatcher, apiBaseResource + apiPathResourceGet, httpMethod.GET, resourceGetRequestHandler)
  return dispatcher
}
