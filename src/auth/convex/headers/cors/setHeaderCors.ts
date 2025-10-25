import { getBaseUrlApp, getBaseUrlSite } from "@/app/url/getBaseUrl"
import { getOriginFromRequest } from "@/auth/convex/headers/getOriginFromRequest"
import { isDevEnv } from "~ui/env/isDevEnv"

const allowedMethods = ["OPTIONS", "GET", "POST"] as const
const allowedHeaders = ["Authorization", "If-Modified-Since", "Content-Type"] as const

const staticCorsHeaders = {
  "Access-Control-Allow-Methods": allowedMethods.join(", "),
  "Access-Control-Allow-Headers": allowedHeaders.join(", "),
  "Access-Control-Max-Age": isDevEnv() ? "100" : "1000",
} as const satisfies HeadersInit

export function setHeaderCors(req: Request, r: Response): Response {
  const allowedOrigins = getAllowedOrigins()
  const requestOrigin = getOriginFromRequest(req) ?? "*"

  for (const [k, v] of Object.entries(staticCorsHeaders)) {
    r.headers.set(k, v)
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    r.headers.set("Access-Control-Allow-Origin", requestOrigin)
  } else {
    // Be conservative - don't allow unexpected origins
    r.headers.delete("Access-Control-Allow-Credentials")
  }
  return r
}

function getAllowedOrigins(): string[] {
  const list = [getBaseUrlApp()!, getBaseUrlSite()!]
  if (isDevEnv()) {
    const vitePort = 3016
    list.push("http://localhost:" + vitePort)
  }
  return list
}
