export function authorizationHeaderGetToken(authorization: string | null): string | null {
  if (authorization === null) return null

  if (!/^Bearer(?:\s|$)/i.test(authorization)) return authorization

  const bearerMatch = authorization.match(/^Bearer\s+(\S+)$/i)
  if (!bearerMatch) return null

  return bearerMatch[1] ?? null
}
