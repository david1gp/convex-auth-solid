import type { Hono } from "hono"
import type { ActionCtx } from "#convex/_generated/server.js"

export type HonoDispatcher = Hono<{ Bindings: ActionCtx }>
