import { useParams } from "@tanstack/solid-router"

export function resourceViewPageStateCreate(demoResourceId: () => string | undefined) {
  const params = demoResourceId() ? undefined : useParams({ strict: false })
  return { resourceId: () => demoResourceId() ?? params?.().resourceId }
}
