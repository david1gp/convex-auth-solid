import { expect, test } from "bun:test"
import * as a from "valibot"
import { handleSchema } from "./handleSchema"

test("handleSchemaValid", () => {
  const validHandles = ["abcde", "hello-world", "test-123", "my-handle-example", "my-name-1"]
  validHandles.forEach((handle) => {
    const result = a.safeParse(handleSchema, handle)
    if (result.success) console.error("wrongly classified ", handle, "as invalid")
    expect(result.success).toBe(true)
  })
})

test("handleSchemaInvalid", () => {
  const invalidHandles = ["wr", "-wrong", "wrong-", "w--rong", "Wrong", "emoji🚀"]
  invalidHandles.forEach((handle) => {
    const result = a.safeParse(handleSchema, handle)
    if (result.success) console.error("wrongly classified ", handle, "as valid")
    expect(result.success).toBe(false)
  })
})
