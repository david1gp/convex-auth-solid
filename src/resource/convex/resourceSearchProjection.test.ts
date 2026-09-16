import { expect, test } from "bun:test"
import { resourceSearchProjection } from "./resourceSearchProjection.ts"

test("resource search projection combines name and description", () => {
  expect(
    resourceSearchProjection({
      name: "Climate report",
      description: "Annual findings",
      type: "report",
      visibility: "public",
      language: "en",
    }),
  ).toEqual({
    searchText: "Climate report Annual findings",
    type: "report",
    visibility: "public",
    language: "en",
  })
})

test("resource search projection omits empty search text", () => {
  expect(resourceSearchProjection({})).toEqual({
    searchText: undefined,
    type: undefined,
    visibility: undefined,
    language: undefined,
  })
})
