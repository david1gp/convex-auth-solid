import { useParams } from "@tanstack/solid-router"

export function resourcePageDemoRendererStateCreate() {
  const params = useParams({ strict: false })
  return { resourceId: () => params().resourceId ?? "sample-resource-1" }
}
