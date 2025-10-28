import { expect, test } from "bun:test"
import * as v from "valibot"
import { handleSchema } from "./handleSchema"

test("handleSchemaValid", () => {
  const validHandles = ["abcde", "hello-world", "test-123", "my-handle-example", "my-name-1"]
  validHandles.forEach((handle) => {
    const result = v.safeParse(handleSchema, handle)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.output).toBe(handle)
    }
  })
})

test("handleSchemaInvalid", () => {
  const invalidHandles = ["wr", "-wrong", "wrong-", "w--rong", "Wrong", "emoji🚀"]
  invalidHandles.forEach((handle) => {
    const result = v.safeParse(handleSchema, handle)
    expect(result.success).toBe(false)
  })
})
