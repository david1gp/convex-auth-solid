import { setHeaderCors } from "@/auth/convex/headers/cors/setHeaderCors"
import { setHeaderServerTimingSingleValue } from "@/auth/convex/headers/setHeaderServerTiming"
import type { ActionCtx } from "@convex/_generated/server"

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
