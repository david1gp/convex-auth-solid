import { expect, test } from "bun:test"
import * as a from "valibot"
import { paginationDefaultOptions } from "./paginationDefaultOptions.js"
import { paginationResultMap } from "./paginationResultMap.js"
import { paginationResultSchema } from "./paginationResultSchema.js"

test("pagination defaults to fifty items from the beginning", () => {
  expect(paginationDefaultOptions).toEqual({ numItems: 50, cursor: null })
})

test("pagination result schema validates the shared envelope", () => {
  const schema = paginationResultSchema(a.object({ id: a.number() }))
  const parsed = a.safeParse(schema, {
    page: [{ id: 1 }],
    isDone: false,
    continueCursor: "cursor-1",
  })

  expect(parsed.success).toBe(true)
})

test("pagination result map maps only the page", () => {
  const result = paginationResultMap(
    { page: [{ id: 1 }, { id: 2 }], isDone: true, continueCursor: "cursor-2" },
    (item) => item.id,
  )

  expect(result).toEqual({ page: [1, 2], isDone: true, continueCursor: "cursor-2" })
})
