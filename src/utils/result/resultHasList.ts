import type { Result } from "#result"

export function resultHasList<T>(r: Result<T[]> | undefined): T[] | null {
  if (!r) return null
  if (!r.success) return null
  const files = r.data
  if (files.length <= 0) return null
  return files
}
