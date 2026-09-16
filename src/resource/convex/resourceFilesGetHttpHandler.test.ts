import { expect, test } from "bun:test"
import type { ActionCtx } from "#convex/_generated/server.js"
import { resourceGetRequestHandler } from "./resourceFilesGetHttpHandler.ts"

test("resource get HTTP handler forwards pagination options", async () => {
  let args: Record<string, unknown> | undefined
  const ctx = {
    runQuery: async (_query: unknown, queryArgs: Record<string, unknown>) => {
      args = queryArgs
      return {
        success: true,
        data: {
          resource: { visibility: "public" },
          files: { page: [], isDone: true, continueCursor: "cursor-next" },
        },
      }
    },
  } as unknown as ActionCtx

  const response = await resourceGetRequestHandler(
    ctx,
    new Request("https://example.com/api/resource/get?resourceId=resource-resource-1&cursor=cursor-0&numItems=10"),
  )

  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({
    resource: { visibility: "public" },
    files: { page: [], isDone: true, continueCursor: "cursor-next" },
  })
  expect(args).toMatchObject({
    resourceId: "resource-resource-1",
    paginationOpts: { cursor: "cursor-0", numItems: 10 },
  })
})

test("resource get HTTP handler defaults to the standard first page", async () => {
  let args: Record<string, unknown> | undefined
  const ctx = {
    runQuery: async (_query: unknown, queryArgs: Record<string, unknown>) => {
      args = queryArgs
      return {
        success: true,
        data: {
          resource: { visibility: "public" },
          files: { page: [], isDone: true, continueCursor: "" },
        },
      }
    },
  } as unknown as ActionCtx

  const response = await resourceGetRequestHandler(
    ctx,
    new Request("https://example.com/api/resource/get?resourceId=resource-resource-1"),
  )

  expect(response.status).toBe(200)
  expect(args).toMatchObject({
    resourceId: "resource-resource-1",
    paginationOpts: { cursor: null, numItems: 50 },
  })
})
