import { describe, expect, test } from "bun:test"
import { pageDemoRouteIsMounted } from "#src/app/demos/pageDemoRouteIsMounted.ts"
import { pageRouteInventory } from "#src/app/demos/pageRouteInventory.ts"
import { getRoutesApp } from "#src/app/getRoutesApp.tsx"
import { getRoutesAuth } from "#src/auth/ui/getRoutesAuth.tsx"
import { getRoutesOrgInvitation } from "#src/org/invitation_url/getRoutesOrgInvitation.ts"
import { getRoutesOrgMember } from "#src/org/member_url/getRoutesOrgMember.ts"
import { getRoutesOrg } from "#src/org/org_url/getRoutesOrg.ts"
import { getRoutesResource } from "#src/resource/url/getRoutesResource.ts"
import { getRoutesWorkspaceInvitation } from "#src/workspace/invitation_url/getRoutesWorkspaceInvitation.ts"
import { getRoutesWorkspaceMember } from "#src/workspace/member_url/getRoutesWorkspaceMember.ts"
import { getRoutesWorkspace } from "#src/workspace/workspace_url/getRoutesWorkspace.ts"

const mountedNonDemoRoutes = [
  ...getRoutesAuth(),
  ...getRoutesApp().filter(({ path }) => !path.startsWith("/demo/")),
  ...getRoutesOrg(),
  ...getRoutesOrgMember(),
  ...getRoutesOrgInvitation(),
  ...getRoutesResource(),
  ...getRoutesWorkspace(),
  ...getRoutesWorkspaceMember(),
  ...getRoutesWorkspaceInvitation(),
]

describe("page demo route inventory", () => {
  test("covers every mounted non-demo route registry entry exactly once", () => {
    const mountedPaths = mountedNonDemoRoutes.map(({ path }) => path).sort()
    const inventoryPaths: string[] = pageRouteInventory.map(({ route }) => route).sort()

    expect(mountedPaths).toHaveLength(48)
    expect(inventoryPaths).toHaveLength(48)
    expect(inventoryPaths).toEqual(mountedPaths)
  })

  test("assigns each route a distinct generator-compatible page demo entry and matching example params", () => {
    const demoEntries = pageRouteInventory.map(({ demoEntry }) => demoEntry)
    expect(new Set(demoEntries).size).toBe(48)

    for (const { route, title, pageImport, params, demoEntry } of pageRouteInventory) {
      expect(title.length).toBeGreaterThan(0)
      expect(pageImport).toMatch(/^#src\/.+\.tsx$/)
      expect(demoEntry).toMatch(/^pages\/Demo[A-Za-z0-9]+$/)

      const routeParams = [...route.matchAll(/:([^/]+)/g)].map(([, key]) => key!).sort()
      expect(Object.keys(params).sort()).toEqual(routeParams)
    }
  })

  test("mounts an isolated page renderer for every inventory route instead of a guarded placeholder", () => {
    const guardedRoutes = pageRouteInventory.filter(({ route }) => !pageDemoRouteIsMounted(route))

    expect(guardedRoutes).toEqual([])
  })

  test("keeps app, organization, workspace, and resource inventory routes in their actual renderer maps", async () => {
    const mapSources = await Promise.all([
      Bun.file(new URL("./appPageDemoRendererMap.tsx", import.meta.url)).text(),
      Bun.file(new URL("../../org/org_ui/demo/orgDemoRendererMap.tsx", import.meta.url)).text(),
      Bun.file(new URL("../../workspace/workspace_ui/WorkspaceCorePageDemos.tsx", import.meta.url)).text(),
      Bun.file(new URL("../../workspace/member_ui/demo/WorkspaceMemberPageDemos.tsx", import.meta.url)).text(),
      Bun.file(new URL("../../workspace/invitation_ui/demo/WorkspaceInvitationPageDemos.tsx", import.meta.url)).text(),
      Bun.file(new URL("../../resource/ui/demo/ResourcePageDemoRenderer.tsx", import.meta.url)).text(),
    ])
    const [app, org, workspace, workspaceMembers, workspaceInvitations, resource] = mapSources

    for (const { route } of pageRouteInventory) {
      const source =
        route.startsWith("/org/") || route === "/org"
          ? org
          : route.startsWith("/workspace/") || route.startsWith("/invite/") || route.startsWith("/w/")
            ? `${workspace}${workspaceMembers}${workspaceInvitations}`
            : route.startsWith("/resources")
              ? resource
              : route === "/" || route === "/overview" || route === "/todo"
                ? app
                : undefined

      if (source !== undefined) expect(source).toContain(`"${route}"`)
    }
  })
})
