import { expect, test, describe } from "bun:test"
import { orgDataPartialSchema } from "@/org/org_model/orgSchema"
import * as a from "valibot"

describe("orgFormLocalStorage", () => {
  test("orgDataPartialSchema validates partial org data", () => {
    const testData = {
      name: "Test Organization",
      description: "Test description",
    }

    const result = a.safeParse(orgDataPartialSchema, testData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.output.name).toBe("Test Organization")
      expect(result.output.description).toBe("Test description")
      expect(result.output.orgHandle).toBeUndefined()
      expect(result.output.url).toBeUndefined()
      expect(result.output.image).toBeUndefined()
    }
  })

  test("orgDataPartialSchema validates empty object", () => {
    const testData = {}

    const result = a.safeParse(orgDataPartialSchema, testData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(Object.keys(result.output)).toHaveLength(0)
    }
  })

  test("orgDataPartialSchema rejects invalid data", () => {
    const testData = {
      orgHandle: "invalid-handle-with-emoji🚀",
    }

    const result = a.safeParse(orgDataPartialSchema, testData)
    expect(result.success).toBe(false)
  })
})
