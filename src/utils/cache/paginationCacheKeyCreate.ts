const secretArgumentKey = /^(accessToken|authToken|authorization|token)$/i

export function paginationCacheKeyCreate(options: {
  identity: string
  query: string
  args: unknown
  scope: unknown
  filters: unknown
  cursor: string | null
  pageSize: number
}): string {
  const key = {
    args: paginationCacheValueSanitize(options.args),
    cursor: options.cursor,
    filters: paginationCacheValueSanitize(options.filters),
    identity: options.identity,
    pageSize: options.pageSize,
    query: options.query,
    scope: paginationCacheValueSanitize(options.scope),
  }
  return `pagination/${paginationCacheValueSerialize(key)}`
}

function paginationCacheValueSanitize(value: unknown, key?: string): unknown {
  if (key && secretArgumentKey.test(key)) return undefined
  if (Array.isArray(value)) return value.map((item) => paginationCacheValueSanitize(item))
  if (!value || typeof value !== "object") return value

  const record = value as Record<string, unknown>
  const sanitized: Record<string, unknown> = {}
  for (const property of Object.keys(record).sort()) {
    const sanitizedValue = paginationCacheValueSanitize(record[property], property)
    if (sanitizedValue !== undefined) sanitized[property] = sanitizedValue
  }
  return sanitized
}

function paginationCacheValueSerialize(value: unknown): string {
  if (value === undefined) return "undefined"
  if (value === null) return "null"
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value === "number" || typeof value === "boolean") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(paginationCacheValueSerialize).join(",")}]`
  if (typeof value === "object") {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${paginationCacheValueSerialize(record[key])}`)
      .join(",")}}`
  }
  return JSON.stringify(String(value))
}
