import { describe, expect, test } from "bun:test"

describe("overview page demo navigation", () => {
  test("omits the live nav with its logout control in demo mode", async () => {
    const source = await Bun.file(new URL("./OverviewPage.tsx", import.meta.url)).text()

    expect(source).toMatch(/\{!p\.demo && \(\s*<NavStatic/)
    expect(source.match(/<NavStatic/g)).toHaveLength(1)
  })

  test("keeps the live navigation for production overview pages", async () => {
    const source = await Bun.file(new URL("./OverviewPage.tsx", import.meta.url)).text()

    expect(source).toContain("{!p.demo && (")
    expect(source).toContain("<NavLinkButton href={urlOverview()} isActive={true}>")
    expect(source).toContain("childrenCenter={<NavCenter />}")
  })
})
