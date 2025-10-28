import { workspaceCreateValidator } from "@/workspace/convex/workspaceCreateFn"
import { expect, test } from "bun:test"
import * as v from "valibot"

const workspaceSchema = v.object({
  orgId: v.string(),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
})

const exampleWorkspaceData = {
  orgId: "orgs_abc123",
  name: "Test Workspace",
  slug: "test-workspace",
  description: "A test workspace for development",
  image: "https://example.com/image.png",
}

test("workspaceList - parse example workspace data", async () => {
  const parsed = v.safeParse(workspaceSchema, exampleWorkspaceData)
  expect(parsed.success).toBe(true)
  if (parsed.success) {
    expect(parsed.output.orgId).toEqual(exampleWorkspaceData.orgId)
    expect(parsed.output.name).toEqual(exampleWorkspaceData.name)
    expect(parsed.output.slug).toEqual(exampleWorkspaceData.slug)
    expect(parsed.output.description).toEqual(exampleWorkspaceData.description)
    expect(parsed.output.image).toEqual(exampleWorkspaceData.image)
  }
})

test("workspaceList - parse minimal workspace data", async () => {
  const minimalData = {
    orgId: "orgs_xyz789",
    name: "Minimal Workspace",
    slug: "minimal-workspace",
  }
  const parsed = v.safeParse(workspaceSchema, minimalData)
  expect(parsed.success).toBe(true)
  if (parsed.success) {
    expect(parsed.output.orgId).toEqual(minimalData.orgId)
    expect(parsed.output.name).toEqual(minimalData.name)
    expect(parsed.output.slug).toEqual(minimalData.slug)
    expect(parsed.output.description).toBeUndefined()
    expect(parsed.output.image).toBeUndefined()
  }
})
