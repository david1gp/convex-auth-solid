export function searchParamGet(key: string, url = new URL(window.location.href)): string | null {
  return url.searchParams.get(key)
}
