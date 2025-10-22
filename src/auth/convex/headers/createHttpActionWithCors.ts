import { addCorsHeaders } from "@/auth/convex/headers/addCorsHeaders"
import { type ActionCtx, httpAction } from "@convex/_generated/server"

export function createHttpActionWithCors(originalHandler: (ctx: ActionCtx, request: Request) => Promise<Response>) {
  return httpAction(async (ctx, request) => {
    const response = await originalHandler(ctx, request)
    return addCorsHeaders(request, response)
  })
}
