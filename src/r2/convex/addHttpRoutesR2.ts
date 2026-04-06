import { addRouteWithCors } from "#src/auth/convex/headers/cors/addRouteWithCors.ts"
import { httpMethod } from "#src/auth/convex/headers/httpMethod.ts"
import { apiBaseR2 } from "#src/r2/api_client/apiBaseR2.ts"
import { apiPathR2FileCreate, r2FileCreateHttpHandler } from "#src/r2/convex/r2FileCreateHttpHandler.ts"
import { r2UploadUrlGetHttpHandler } from "#src/r2/convex/r2UploadUrlGetHttpHandler.ts"
import type { HttpRouter } from "convex/server"
import { apiPathR2UploadUrl } from "../api_client/apiR2GetUploadUrl.js"

export function addHttpRoutesR2(http: HttpRouter) {
  addRouteWithCors(http, apiBaseR2 + apiPathR2UploadUrl, httpMethod.GET, r2UploadUrlGetHttpHandler)
  addRouteWithCors(http, apiBaseR2 + apiPathR2FileCreate, httpMethod.POST, r2FileCreateHttpHandler)
  return http
}
