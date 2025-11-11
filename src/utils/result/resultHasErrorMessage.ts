import type { Result } from "~utils/result/Result"

export function resultHasErrorMessage<T>(r: Result<T> | undefined) {
  if (!r) return ""
  if (!r.success) return r.errorMessage
  return ""
}
