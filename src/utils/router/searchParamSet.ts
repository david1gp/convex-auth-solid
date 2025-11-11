export function searchParamSet(key: string, value: string, url = new URL(window.location.href)): void {
  return url.searchParams.set(key, value)
}
