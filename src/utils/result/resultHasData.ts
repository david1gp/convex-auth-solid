import type { Result } from "~utils/result/Result"

export function resultHasData<T>(r: Result<T> | undefined): T | null {
  if (!r) return null
  if (!r.success) return null
  return r.data
}
