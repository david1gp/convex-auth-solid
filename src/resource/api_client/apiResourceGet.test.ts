import { expect, test } from "bun:test"
import { apiResourceGet } from "./apiResourceGet.ts"

test("apiResourceGet sends pagination options and parses the resource page envelope", async () => {
  const previousBaseUrl = process.env.PUBLIC_BASE_URL_API
  const previousFetch = globalThis.fetch
  process.env.PUBLIC_BASE_URL_API = "https://example.com"

  let requestUrl = ""
  globalThis.fetch = (async (input) => {
    requestUrl = String(input)
    return new Response(
      JSON.stringify({
        resource: {
          resourceId: "resource-resource-1",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        files: {
          page: [],
          isDone: true,
          continueCursor: "cursor-1",
        },
      }),
      { status: 200 },
    )
  }) as typeof fetch

  try {
    const result = await apiResourceGet({
      resourceId: "resource-resource-1",
      paginationOpts: { cursor: "cursor-0", numItems: 10 },
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.files).toEqual({ page: [], isDone: true, continueCursor: "cursor-1" })
    }

    const url = new URL(requestUrl)
    expect(url.searchParams.get("resourceId")).toBe("resource-resource-1")
    expect(url.searchParams.get("cursor")).toBe("cursor-0")
    expect(url.searchParams.get("numItems")).toBe("10")
  } finally {
    globalThis.fetch = previousFetch
    if (previousBaseUrl === undefined) delete process.env.PUBLIC_BASE_URL_API
    else process.env.PUBLIC_BASE_URL_API = previousBaseUrl
  }
})
