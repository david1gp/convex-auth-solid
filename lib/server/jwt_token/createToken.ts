import { SignJWT } from "jose"
import { tokenValidDurationInDays } from "./tokenValidDurationInDays"

export async function createToken(
  userId: string,
  secret: string,
  expiresInDays = tokenValidDurationInDays,
): Promise<string> {
  if (!secret) throw new Error("env.AUTH_SECRET is empty / not set")
  const encodedSecret = new TextEncoder().encode(secret)
  const alg = "HS256"
  const jwt = await new SignJWT()
    .setProtectedHeader({ alg })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${expiresInDays}d`)
    .sign(encodedSecret)
  return jwt
}
