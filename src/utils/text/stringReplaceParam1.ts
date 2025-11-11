export function stringReplaceParam1(url: string, paramName: string, value: string) {
  return url.replace(`:${paramName}`, value)
}
