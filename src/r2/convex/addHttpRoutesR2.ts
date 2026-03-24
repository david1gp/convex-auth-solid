import { addRouteWithCors } from "#src/auth/convex/headers/cors/addRouteWithCors.js"
import { httpMethod } from "#src/auth/convex/headers/httpMethod.js"
import { apiBaseR2 } from "#src/r2/client/apiBaseR2.js"
import { apiPathR2FileCreate, r2FileCreateHttpHandler } from "#src/r2/convex/r2FileCreateHttpHandler.js"
import { r2UploadUrlGetHttpHandler } from "#src/r2/convex/r2UploadUrlGetHttpHandler.js"
import type { HttpRouter } from "convex/server"
import { apiPathR2UploadUrl } from "../client/apiR2GetUploadUrl.js"

export function addHttpRoutesR2(http: HttpRouter) {
  addRouteWithCors(http, apiBaseR2 + apiPathR2UploadUrl, httpMethod.GET, r2UploadUrlGetHttpHandler)
  addRouteWithCors(http, apiBaseR2 + apiPathR2FileCreate, httpMethod.POST, r2FileCreateHttpHandler)
  return http
}
