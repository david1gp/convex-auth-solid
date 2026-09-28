import { describe, expect, test } from "bun:test"
import { demoCatalogDataCreate } from "#src/app/demos/demoCatalogDataCreate.ts"

describe("demo catalog data", () => {
  test("creates category and demo names without exposing component values", () => {
    const component = () => null
    expect(
      demoCatalogDataCreate({
        auth: { DemoSignIn: component },
        ui: { DemoButton: component, DemoModal: component },
      }),
    ).toEqual([
      { category: "auth", demos: ["DemoSignIn"] },
      { category: "ui", demos: ["DemoButton", "DemoModal"] },
    ])
  })
})
