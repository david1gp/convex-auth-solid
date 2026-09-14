import { Hono } from "hono"
import type { ActionCtx } from "#convex/_generated/server.js"
import type { HonoDispatcher } from "#src/auth/convex/headers/honoDispatcher.ts"

export function createHonoDispatcher(): HonoDispatcher {
  return new Hono<{ Bindings: ActionCtx }>()
}
