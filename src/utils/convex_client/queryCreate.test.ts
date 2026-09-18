import { describe, expect, mock, test } from "bun:test"
import type { FunctionReference } from "convex/server"
import { createResult, createResultError } from "#result"

const solidJsClientPath = "solid-js/dist/solid.js"
type SolidJsModule = typeof import("solid-js")
const solidJsClient = (await import(solidJsClientPath)) as unknown as SolidJsModule
mock.module("solid-js", () => solidJsClient)
const { createRoot, createSignal, getOwner } = solidJsClient
const { ConvexContext } = await import("./convexContext.ts")
const { queryCreate } = await import("./queryCreate.ts")
mock.restore()

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

  test("resubscribes when reactive arguments change", async () => {
    const client = new FakeConvexClient()
    const subscriptions: unknown[] = []
    client.onUpdate = (_query, args, update) => {
      subscriptions.push(args)
      client.update = update
      return () => undefined
    }

    let setWorkspaceHandle: ((value: string) => void) | undefined
    const dispose = createRoot((disposeRoot) => {
      const owner = getOwner()!
      owner.context = { [ConvexContext.id]: client }
      const [workspaceHandle, setHandle] = createSignal("")
      setWorkspaceHandle = setHandle
      queryCreate(query, () => ({ workspaceHandle: workspaceHandle() }))
      return disposeRoot
    })

    expect(subscriptions).toEqual([{ workspaceHandle: "" }])
    setWorkspaceHandle?.("e2e-increment1-workspace-20260918-0859")
    await Promise.resolve()
    expect(subscriptions).toEqual([
      { workspaceHandle: "" },
      { workspaceHandle: "e2e-increment1-workspace-20260918-0859" },
    ])
    dispose()
  })
})
