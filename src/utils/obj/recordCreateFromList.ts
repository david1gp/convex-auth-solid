export function recordCreateFromList<T>(
  list: T[] | undefined,
  getId: (t: T) => string,
  getName: (t: T) => string,
): Record<string, string> {
  const r: Record<string, string> = {}
  if (!list) return r
  for (const e of list) {
    const id = getId(e)
    const name = getName(e)
    r[id] = name
  }
  return r
}
