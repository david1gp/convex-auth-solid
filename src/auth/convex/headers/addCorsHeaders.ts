import { getClientOriginFromRequest } from "@/auth/convex/headers/getClientOriginFromRequest"
import { setServerTimingHeaderSingleValue } from "@/auth/convex/headers/setServerTimingHeader"
import type { ActionCtx } from "@convex/_generated/server"

const allowedMethods = ["OPTIONS", "GET", "POST"] as const
const allowedHeaders = ["Authorization", "If-Modified-Since", "Content-Type"] as const

const corsHeadersStatic = {
  // "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": allowedMethods.join(", "),
  "Access-Control-Allow-Headers": allowedHeaders.join(", "),
  "Access-Control-Allow-Credentials": "true",
  // "Access-Control-Max-Age": isDevEnv() ? "100" : "1800",
  "Access-Control-Max-Age": "100",
} as const satisfies HeadersInit

export function addCorsHeaders(req: Request, r: Response): Response {
  for (const [k, v] of Object.entries(corsHeadersStatic)) {
    r.headers.set(k, v)
  }
  const op = "addCorsHeaders"
  const origin = getClientOriginFromRequest(req) ?? "*"
  r.headers.set("Access-Control-Allow-Origin", origin)
  return r
}

export async function returnCorsPreflightResponse(
  ctx: ActionCtx,
  req: Request,
  startedAt: number = Date.now(),
): Promise<Response> {
  const op = "returnCorsPreflightResponse"
  const r = new Response("")
  addCorsHeaders(req, r)
  return setServerTimingHeaderSingleValue(r, op, startedAt)
}
