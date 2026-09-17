import type { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server"
import { type Accessor, createRenderEffect, createSignal, onCleanup, useContext } from "solid-js"
import { createResultError, type ResultErr } from "#result"
import { ConvexContext } from "./convexContext.js"

type QueryArgs<Query extends FunctionReference<"query">> = FunctionArgs<Query> | Accessor<FunctionArgs<Query>>
type QueryResult<Query extends FunctionReference<"query">> = FunctionReturnType<Query> | ResultErr | undefined

export function queryCreate<Query extends FunctionReference<"query">>(
  query: Query,
  args: QueryArgs<Query> = {},
): () => QueryResult<Query> {
  const op = "queryCreate"
  const convex = useContext(ConvexContext)
  if (convex === undefined) {
    const error = createResultError(op, "No convex context")
    return () => error
  }

  const [result, setResult] = createSignal<FunctionReturnType<Query> | undefined>(undefined, { equals: false })
  let subscriptionId = 0
  const getArgs: Accessor<FunctionArgs<Query>> =
    typeof args === "function" ? (args as Accessor<FunctionArgs<Query>>) : () => args ?? {}

  createRenderEffect(() => {
    const fullArgs = getArgs()
    const currentSubscriptionId = ++subscriptionId
    setResult(undefined)
    const unsubscriber = convex.onUpdate(query, fullArgs, (nextResult) => {
      if (currentSubscriptionId !== subscriptionId) return
      setResult(nextResult)
    })
    onCleanup(() => {
      if (currentSubscriptionId === subscriptionId) subscriptionId += 1
      unsubscriber()
    })
  })

  return result
}
