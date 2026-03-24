import type { Result } from "#result"

export function resultHasErrorMessage<T>(r: Result<T> | undefined) {
  if (!r) return ""
  if (!r.success) return r.errorMessage
  return ""
}
