import { type FunctionArgs, type FunctionReference, type FunctionReturnType } from "convex/server"
import { useContext } from "solid-js"
import { ConvexContext } from "./convexContext"

export function createAction<Action extends FunctionReference<"action">>(
  action: Action,
): (args: FunctionArgs<Action>) => Promise<Awaited<FunctionReturnType<Action>>> {
  const convex = useContext(ConvexContext)
  if (convex === undefined) {
    throw "No convex context"
  }
  return (args) => {
    let fullArgs = args ?? {}
    return convex.action(action, fullArgs)
  }
}
