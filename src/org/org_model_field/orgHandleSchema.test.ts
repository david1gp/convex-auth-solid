import { expect, test } from "bun:test"
import * as a from "valibot"
import { orgHandleSchema } from "./orgHandleSchema"

test("orgHandleSchemaValid", () => {
  const validHandles = ["abcde", "Hello-World", "Test-123", "My-Handle-Example", "My-Name-1", "ABC", "TestHandle"]
  validHandles.forEach((handle) => {
    const result = a.safeParse(orgHandleSchema, handle)
    if (result.success) console.log("wrongly classified ", handle, "as invalid")
    expect(result.success).toBe(true)
  })
})

test("orgHandleSchemaInvalid", () => {
  const invalidHandles = ["w", "-wrong", "wrong-", "w--rong", "emoji🚀", "with space", "with@symbol"]
  invalidHandles.forEach((handle) => {
    const result = a.safeParse(orgHandleSchema, handle)
    if (result.success) console.log("wrongly classified ", handle, "as valid")
    expect(result.success).toBe(false)
  })
})
