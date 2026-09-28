import { useParams } from "@tanstack/solid-router"

export function userProfilePageStateCreate() {
  const params = useParams({ strict: false })
  return { username: () => params().username }
}
