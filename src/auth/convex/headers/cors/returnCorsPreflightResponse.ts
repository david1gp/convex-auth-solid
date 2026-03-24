import type { ActionCtx } from "#convex/_generated/server.js"
import { setHeaderCors } from "#src/auth/convex/headers/cors/setHeaderCors.js"
import { setHeaderServerTimingSingleValue } from "#src/auth/convex/headers/setHeaderServerTiming.js"

export async function returnCorsPreflightResponse(
  ctx: ActionCtx,
  req: Request,
  startedAt: number = Date.now(),
): Promise<Response> {
  const op = "returnCorsPreflightResponse"
  const r = new Response("")
  setHeaderCors(req, r)
  return setHeaderServerTimingSingleValue(r, op, startedAt)
}
