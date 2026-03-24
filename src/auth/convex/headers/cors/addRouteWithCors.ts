import { corsOptionsHttpHandler } from "#src/auth/convex/headers/cors/corsOptionsHttpHandler.js"
import { createHttpActionWithCors } from "#src/auth/convex/headers/cors/createHttpActionWithCors.js"
import type { HttpMethod } from "#src/auth/convex/headers/httpMethod.js"
import type { ActionCtx } from "@convex/_generated/server.js"
import type { HttpRouter } from "convex/server"

export type ConvexHandlerType = (ctx: ActionCtx, request: Request) => Promise<Response>

export function addRouteWithCors(
  http: HttpRouter,
  path: string,
  method: HttpMethod,
  handler: ConvexHandlerType,
): HttpRouter {
  const corsHandler = createHttpActionWithCors(handler)
  http.route({
    path,
    method,
    handler: corsHandler,
  })
  http.route({
    path,
    method: "OPTIONS",
    handler: corsOptionsHttpHandler,
  })
  return http
}
