export function stringReplaceParam2(url: string, p1: string, v1: string, p2: string, v2: string) {
  return url.replace(`:${p1}`, v1).replace(`:${p2}`, v2)
}
