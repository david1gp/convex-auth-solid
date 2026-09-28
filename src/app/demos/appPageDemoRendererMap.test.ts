import { describe, expect, test } from "bun:test"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"

describe("app core page demos", () => {
  test("maps overview aliases and todo to dedicated renderers", () => {
    return Bun.file(new URL("./appPageDemoRendererMap.tsx", import.meta.url))
      .text()
      .then((source) => {
        expect(source).toContain('"/": OverviewPageDemo')
        expect(source).toContain('"/overview": OverviewPageDemo')
        expect(source).toContain('"/todo": TodoPageDemo')
        expect(source).toContain("<OverviewPage demo />")
        expect(source).toContain('<TodoPage demo title="To do" />')
      })
  })

  test("demo cross-links resolve only to isolated gallery URLs", () => {
    for (const route of ["/", "/overview", "/todo"] as const) {
      expect(pageDemoHref(route)).toStartWith("/demos/pages/")
      expect(pageDemoHref(route)).not.toBe(route)
    }
  })
})
