import { addRouteWithCors } from "@/auth/convex/headers/cors/addRouteWithCors"
import { httpMethod } from "@/auth/convex/headers/httpMethod"
import { apiBaseR2 } from "@/r2/client/apiBaseR2"
import { apiPathR2FileCreate, r2FileCreateHttpHandler } from "@/r2/convex/r2FileCreateHttpHandler"
import { r2UploadUrlGetHttpHandler } from "@/r2/convex/r2UploadUrlGetHttpHandler"
import type { HttpRouter } from "convex/server"
import { apiPathR2UploadUrl } from "../client/apiR2GetUploadUrl"

export function addHttpRoutesR2(http: HttpRouter) {
  addRouteWithCors(http, apiBaseR2 + apiPathR2UploadUrl, httpMethod.GET, r2UploadUrlGetHttpHandler)
  addRouteWithCors(http, apiBaseR2 + apiPathR2FileCreate, httpMethod.POST, r2FileCreateHttpHandler)
  return http
}
