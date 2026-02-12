import type { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server"
import { from, useContext } from "solid-js"
import { ConvexContext } from "./convexContext"

export function createQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: FunctionArgs<Query> = {},
): () => FunctionReturnType<Query> | undefined {
  const convex = useContext(ConvexContext)
  if (convex === undefined) {
    throw "No convex context"
  }
  let fullArgs = args ?? {}
  return from((setter) => {
    const unsubscriber = convex!.onUpdate(query, fullArgs, setter)
    return unsubscriber
  })
}
