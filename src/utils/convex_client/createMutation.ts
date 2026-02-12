import type { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server"
import { useContext } from "solid-js"
import { ConvexContext } from "./convexContext"

export function createMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): (args?: FunctionArgs<Mutation>) => Promise<FunctionReturnType<Mutation>> {
  const convex = useContext(ConvexContext)
  if (convex === undefined) {
    throw "No convex context"
  }
  return (args) => {
    let fullArgs = args ?? {}
    return convex.mutation(mutation, fullArgs)
  }
}
