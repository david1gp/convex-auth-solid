import { expect, test } from "bun:test"
import * as v from "valibot"
import { slugSchema } from "./slugSchema"

test("slugSchemaValid", () => {
  const validSlugs = ["abcde", "hello-world", "test-123", "my-slug-example", "my-name-1"]
  validSlugs.forEach((slug) => {
    const result = v.safeParse(slugSchema, slug)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.output).toBe(slug)
    }
  })
})

test("slugSchemaInvalid", () => {
  const invalidSlugs = ["wr", "-wrong", "wrong-", "w--rong", "Wrong", "emoji🚀"]
  invalidSlugs.forEach((slug) => {
    const result = v.safeParse(slugSchema, slug)
    expect(result.success).toBe(false)
  })
})
