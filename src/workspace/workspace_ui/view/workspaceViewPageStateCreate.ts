import { useParams } from "@tanstack/solid-router"

export function workspaceViewPageStateCreate() {
  const params = useParams({ strict: false })
  return { workspaceHandle: () => params().workspaceHandle }
}
