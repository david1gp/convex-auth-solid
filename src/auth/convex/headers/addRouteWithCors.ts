import { corsOptionsHttpHandler } from "@/auth/convex/headers/corsHttpHandler"
import { createHttpActionWithCors } from "@/auth/convex/headers/createHttpActionWithCors"
import type { HttpMethod } from "@/auth/convex/headers/httpMethod"
import type { ActionCtx } from "@convex/_generated/server"
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
