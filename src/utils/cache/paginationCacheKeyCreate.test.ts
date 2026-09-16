import { describe, expect, test } from "bun:test"
import { paginationCacheKeyCreate } from "./paginationCacheKeyCreate.ts"

describe("paginationCacheKeyCreate", () => {
  test("is stable for object property order and excludes auth tokens", () => {
    const first = paginationCacheKeyCreate({
      identity: "user-1",
      query: "members",
      args: { token: "secret", workspaceHandle: "one", filters: { role: "member", page: 1 } },
      scope: "workspace-one",
      filters: { role: "member" },
      cursor: null,
      pageSize: 50,
    })
    const second = paginationCacheKeyCreate({
      identity: "user-1",
      query: "members",
      args: { filters: { page: 1, role: "member" }, workspaceHandle: "one", token: "different" },
      scope: "workspace-one",
      filters: { role: "member" },
      cursor: null,
      pageSize: 50,
    })

    expect(first).toBe(second)
    expect(first).not.toContain("secret")
    expect(first).not.toContain("different")
    expect(first).not.toContain("token")
  })

  test("distinguishes identity, scope, filters, and cursors", () => {
    const makeKey = (overrides: Partial<Parameters<typeof paginationCacheKeyCreate>[0]> = {}) =>
      paginationCacheKeyCreate({
        identity: "user-1",
        query: "members",
        args: { workspaceHandle: "one" },
        scope: "workspace-one",
        filters: { role: "member" },
        cursor: null,
        pageSize: 50,
        ...overrides,
      })

    expect(makeKey({ identity: "user-2" })).not.toBe(makeKey())
    expect(makeKey({ scope: "workspace-two" })).not.toBe(makeKey())
    expect(makeKey({ filters: { role: "admin" } })).not.toBe(makeKey())
    expect(makeKey({ cursor: "cursor-1" })).not.toBe(makeKey())
  })
})
