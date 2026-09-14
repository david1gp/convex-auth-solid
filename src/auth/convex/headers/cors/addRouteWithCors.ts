import type { ActionCtx } from "#convex/_generated/server.js"
import { returnCorsPreflightResponse } from "#src/auth/convex/headers/cors/returnCorsPreflightResponse.ts"
import { setHeaderCors } from "#src/auth/convex/headers/cors/setHeaderCors.ts"
import type { HonoDispatcher } from "#src/auth/convex/headers/honoDispatcher.ts"
import type { HttpMethod } from "#src/auth/convex/headers/httpMethod.ts"

export type ConvexHandlerType = (ctx: ActionCtx, request: Request) => Promise<Response>

export function addRouteWithCors(
  dispatcher: HonoDispatcher,
  path: string,
  method: HttpMethod,
  handler: ConvexHandlerType,
): HonoDispatcher {
  dispatcher.on(method, path, async (c) => {
    const response = await handler(c.env, c.req.raw)
    return setHeaderCors(c.req.raw, response)
  })
  dispatcher.on("OPTIONS", path, async (c) => {
    return returnCorsPreflightResponse(c.env, c.req.raw)
  })
  return dispatcher
}
