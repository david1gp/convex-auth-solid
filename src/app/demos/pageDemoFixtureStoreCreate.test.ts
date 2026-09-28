import { describe, expect, test } from "bun:test"
import { pageDemoFixtureStoreCreate } from "#src/app/demos/pageDemoFixtureStoreCreate.ts"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { pageDemoTransportCreate } from "#src/app/demos/pageDemoTransportCreate.ts"

describe("page demo fixture infrastructure", () => {
  test("shares local fixtures across route consumers and isolates separately-created stores", () => {
    const firstRouteStore = pageDemoFixtureStoreGet()
    firstRouteStore.clear()
    firstRouteStore.set("orgs/sample-org", { name: "Sample" })

    const nextRouteStore = pageDemoFixtureStoreGet()
    expect(nextRouteStore.get<{ name: string }>("orgs/sample-org")).toEqual({ name: "Sample" })
    nextRouteStore.update<{ name: string }>("orgs/sample-org", (org) => ({ ...org!, name: "Updated" }))
    expect(firstRouteStore.get<{ name: string }>("orgs/sample-org")?.name).toBe("Updated")

    const isolatedStore = pageDemoFixtureStoreCreate()
    expect(isolatedStore.has("orgs/sample-org")).toBe(false)
    isolatedStore.set("orgs/sample-org", { name: "Isolated" })
    expect(nextRouteStore.get<{ name: string }>("orgs/sample-org")?.name).toBe("Updated")
    firstRouteStore.clear()
  })

  test("fails closed for backend, auth, credential, and upload operations", async () => {
    let backendCallCount = 0
    const transport = pageDemoTransportCreate()
    const input = { run: () => backendCallCount++ }
    const results = await Promise.all([
      transport.convexAction(input),
      transport.authenticate(input),
      transport.useCredential(input),
      transport.upload(input),
    ])

    expect(results.every((result) => !result.success)).toBe(true)
    expect(backendCallCount).toBe(0)
    expect(results.map((result) => result.op)).toEqual([
      "pageDemoConvexAction",
      "pageDemoAuthenticate",
      "pageDemoCredential",
      "pageDemoUpload",
    ])
  })
})
