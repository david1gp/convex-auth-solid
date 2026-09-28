import { expect, test } from "bun:test"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"

test("organization list, create, view and sibling links remain in the demo gallery", () => {
  expect(pageDemoHref("/org")).toBe("/demos/pages/org")
  expect(pageDemoHref("/org/create")).toBe("/demos/pages/org/create")
  expect(pageDemoHref("/org/:orgHandle", { orgHandle: "new-org" })).toBe("/demos/pages/org/new-org")
  expect(pageDemoHref("/org/:orgHandle/edit", { orgHandle: "new-org" })).toBe("/demos/pages/org/new-org/edit")
  expect(pageDemoHref("/org/:orgHandle/members", { orgHandle: "new-org" })).toBe("/demos/pages/org/new-org/members")
  expect(pageDemoHref("/org/:orgHandle/invitations", { orgHandle: "new-org" })).toBe(
    "/demos/pages/org/new-org/invitations",
  )
})
