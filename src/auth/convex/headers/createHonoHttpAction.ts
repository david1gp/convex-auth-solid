import { httpAction } from "#convex/_generated/server.js"
import type { HonoDispatcher } from "#src/auth/convex/headers/honoDispatcher.ts"

export function createHonoHttpAction(dispatcher: HonoDispatcher) {
  return httpAction(async (ctx, request) => dispatcher.fetch(request, ctx))
}
