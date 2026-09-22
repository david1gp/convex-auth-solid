import { describe, expect, test } from "bun:test"
import * as a from "valibot"
import { valibotObjectToConvexFields, valibotToConvex } from "./valibotToConvex.ts"

describe("valibotToConvex", () => {
  test("converts table field schemas while preserving Convex field optionality", () => {
    const fields = valibotToConvex({
      text: a.pipe(a.string(), a.trim()),
      count: a.number(),
      enabled: a.boolean(),
      missing: a.optional(a.string()),
      nullable: a.nullable(a.string()),
      choice: a.enum({ red: "red", blue: "blue" }),
      items: a.array(a.string()),
      nested: a.object({
        value: a.string(),
        optionalValue: a.optional(a.number()),
      }),
      dictionary: a.record(a.string(), a.number()),
    })

    expect(fields.text.kind).toBe("string")
    expect(fields.text.isOptional).toBe("required")
    expect(fields.count.kind).toBe("float64")
    expect(fields.enabled.kind).toBe("boolean")
    expect(fields.missing.isOptional).toBe("optional")
    expect(fields.nullable.kind).toBe("union")
    expect(fields.choice.kind).toBe("union")
    expect(fields.items.kind).toBe("array")
    expect(fields.nested.kind).toBe("object")
    const nested = fields.nested as unknown as { fields: { optionalValue: { isOptional: string } } }
    expect(nested.fields.optionalValue.isOptional).toBe("optional")
    expect(fields.dictionary.kind).toBe("record")
  })

  test("converts a piped object schema through its underlying object entries", () => {
    const fields = valibotObjectToConvexFields(
      a.pipe(
        a.object({
          name: a.string(),
          deletedAt: a.optional(a.string()),
        }),
        a.check(() => true),
      ),
    )

    expect(fields.name.kind).toBe("string")
    expect(fields.deletedAt.isOptional).toBe("optional")
  })
})
