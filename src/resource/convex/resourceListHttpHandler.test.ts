import { expect, test } from "bun:test"
import type { ActionCtx } from "#convex/_generated/server.js"
import { resourceListHttpHandler } from "./resourceListHttpHandler.ts"

test("resource list HTTP handler forwards filters and pagination", async () => {
  let args: Record<string, unknown> | undefined
  const ctx = {
    runQuery: async (_query: unknown, queryArgs: Record<string, unknown>) => {
      args = queryArgs
      return { page: [], isDone: true, continueCursor: "cursor-next" }
    },
  } as unknown as ActionCtx

  const response = await resourceListHttpHandler(
    ctx,
    new Request(
      "https://example.com/api/resource/list?orgHandle=adaptive&type=report&visibility=public&l=en&searchText=climate&cursor=cursor-0&numItems=10",
    ),
  )

  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({ page: [], isDone: true, continueCursor: "cursor-next" })
  expect(args).toMatchObject({
    orgHandle: "adaptive",
    type: "report",
    visibility: "public",
    l: "en",
    searchText: "climate",
    paginationOpts: { cursor: "cursor-0", numItems: 10 },
  })
})
