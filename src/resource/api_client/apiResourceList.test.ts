import { expect, test } from "bun:test"
import { apiResourceList } from "./apiResourceList.ts"

test("apiResourceList sends filters and pagination options and parses the page envelope", async () => {
  const previousBaseUrl = process.env.PUBLIC_BASE_URL_API
  const previousFetch = globalThis.fetch
  process.env.PUBLIC_BASE_URL_API = "https://example.com"

  let requestUrl = ""
  globalThis.fetch = (async (input) => {
    requestUrl = String(input)
    return new Response(
      JSON.stringify({
        page: [],
        isDone: true,
        continueCursor: "cursor-1",
      }),
      { status: 200 },
    )
  }) as typeof fetch

  try {
    const result = await apiResourceList({
      orgHandle: "adaptive",
      l: "en",
      type: "report",
      visibility: "public",
      searchText: "climate report",
      paginationOpts: { cursor: "cursor-0", numItems: 10 },
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ page: [], isDone: true, continueCursor: "cursor-1" })
    }

    const url = new URL(requestUrl)
    expect(url.searchParams.get("orgHandle")).toBe("adaptive")
    expect(url.searchParams.get("l")).toBe("en")
    expect(url.searchParams.get("type")).toBe("report")
    expect(url.searchParams.get("visibility")).toBe("public")
    expect(url.searchParams.get("searchText")).toBe("climate report")
    expect(url.searchParams.get("cursor")).toBe("cursor-0")
    expect(url.searchParams.get("numItems")).toBe("10")
  } finally {
    globalThis.fetch = previousFetch
    if (previousBaseUrl === undefined) delete process.env.PUBLIC_BASE_URL_API
    else process.env.PUBLIC_BASE_URL_API = previousBaseUrl
  }
})
