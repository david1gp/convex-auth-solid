import { describe, expect, test } from "bun:test"
import type { FunctionReference } from "convex/server"
import { createRoot, getOwner } from "solid-js"
import { createResult, createResultError } from "#result"
import { ConvexContext } from "./convexContext.ts"
import { queryCreate } from "./queryCreate.ts"

type QueryUpdate = (value: unknown) => void

class FakeConvexClient {
  update: QueryUpdate | undefined

  onUpdate(_query: unknown, _args: unknown, update: QueryUpdate) {
    this.update = update
    return () => undefined
  }
}

const query = {} as FunctionReference<"query">

describe("queryCreate", () => {
  test("returns a Result error when the Convex context is missing", () => {
    let getResult: (() => unknown) | undefined
    const dispose = createRoot((disposeRoot) => {
      getResult = queryCreate(query)
      return disposeRoot
    })

    expect(getResult?.()).toEqual(createResultError("queryCreate", "No convex context"))
    dispose()
  })

  test("preserves the backend result payload without wrapping it again", () => {
    const client = new FakeConvexClient()
    let getResult: (() => unknown) | undefined
    const dispose = createRoot((disposeRoot) => {
      const owner = getOwner()!
      owner.context = { [ConvexContext.id]: client }
      getResult = queryCreate(query)
      return disposeRoot
    })

    expect(getResult?.()).toBeUndefined()
    const backendResult = createResult({ value: "ok" })
    client.update?.(backendResult)
    expect(getResult?.()).toBe(backendResult)
    const rawResult = { value: "raw" }
    client.update?.(rawResult)
    expect(getResult?.()).toBe(rawResult)
    dispose()
  })
})
