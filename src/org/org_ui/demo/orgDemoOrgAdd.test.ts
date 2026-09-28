import { describe, expect, test } from "bun:test"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { orgDemoOrgAdd } from "#src/org/org_ui/demo/orgDemoOrgAdd.ts"

describe("organization core demo fixture updates", () => {
  const existing: OrgModel[] = [
    {
      orgHandle: "sample-org",
      name: "Sample Organization",
      createdAt: "2026-09-28T09:00:00.000Z",
      updatedAt: "2026-09-28T09:00:00.000Z",
    },
  ]
  const draft = { orgHandle: "new-org", name: "New Organization", description: "New demo", url: "", image: "" }

  test("create prepends a new organization without changing existing fixture data", () => {
    const result = orgDemoOrgAdd(existing, draft)
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.map((org) => org.orgHandle)).toEqual(["new-org", "sample-org"])
    expect(result.data[0]?.description).toBe("New demo")
    expect(existing).toHaveLength(1)
  })

  test("duplicate handles do not update the organization list", () => {
    const result = orgDemoOrgAdd(existing, { ...draft, orgHandle: "sample-org" })
    expect(result.success).toBe(false)
    expect(existing).toHaveLength(1)
  })
})
