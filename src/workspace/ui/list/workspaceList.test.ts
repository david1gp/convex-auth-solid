import { expect, test } from "bun:test"
import * as a from "valibot"

const workspaceSchema = a.object({
  orgId: a.string(),
  name: a.string(),
  handle: a.string(),
  description: a.optional(a.string()),
  image: a.optional(a.string()),
})

const exampleWorkspaceData = {
  orgId: "orgs_abc123",
  name: "Test Workspace",
  handle: "test-workspace",
  description: "A test workspace for development",
  image: "https://example.com/image.png",
}

test("workspaceList - parse example workspace data", async () => {
  const parsed = a.safeParse(workspaceSchema, exampleWorkspaceData)
  expect(parsed.success).toBe(true)
  if (parsed.success) {
    expect(parsed.output.orgId).toEqual(exampleWorkspaceData.orgId)
    expect(parsed.output.name).toEqual(exampleWorkspaceData.name)
    expect(parsed.output.handle).toEqual(exampleWorkspaceData.handle)
    expect(parsed.output.description).toEqual(exampleWorkspaceData.description)
    expect(parsed.output.image).toEqual(exampleWorkspaceData.image)
  }
})

test("workspaceList - parse minimal workspace data", async () => {
  const minimalData = {
    orgId: "orgs_xyz789",
    name: "Minimal Workspace",
    handle: "minimal-workspace",
  }
  const parsed = a.safeParse(workspaceSchema, minimalData)
  expect(parsed.success).toBe(true)
  if (parsed.success) {
    expect(parsed.output.orgId).toEqual(minimalData.orgId)
    expect(parsed.output.name).toEqual(minimalData.name)
    expect(parsed.output.handle).toEqual(minimalData.handle)
    expect(parsed.output.description).toBeUndefined()
    expect(parsed.output.image).toBeUndefined()
  }
})
