import { getDefaultUrlSignedIn } from "#src/auth/url/getDefaultUrlSignedIn.ts"

/** Normalizes return destination ensuring it never loops back to /sso and stays on the app host. */
export function allgroupsSsoReturnToResolve(rawReturnTo?: string | null): string {
  const fallback = getDefaultUrlSignedIn()
  if (!rawReturnTo) return fallback
  const trimmed = rawReturnTo.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback
  }

  for (const character of trimmed) {
    const code = character.codePointAt(0) ?? 0
    if (code <= 31 || code === 127) return fallback
  }

  try {
    const parsed = new URL(trimmed, "https://allgroups.example.invalid")
    if (parsed.pathname === "/sso" || parsed.pathname.startsWith("/sso/")) {
      return fallback
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
