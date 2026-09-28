import { expect, test } from "bun:test"
import { authorizationHeaderGetToken } from "./authorizationHeaderGetToken.ts"

test("authorization header accepts a raw session JWT", () => {
  expect(authorizationHeaderGetToken("session-jwt")).toBe("session-jwt")
})

test("authorization header extracts a Bearer session JWT", () => {
  expect(authorizationHeaderGetToken("Bearer session-jwt")).toBe("session-jwt")
  expect(authorizationHeaderGetToken("bearer  session-jwt")).toBe("session-jwt")
})

test("authorization header rejects malformed or empty Bearer credentials", () => {
  expect(authorizationHeaderGetToken("Bearer")).toBeNull()
  expect(authorizationHeaderGetToken("Bearer   ")).toBeNull()
  expect(authorizationHeaderGetToken("Bearer session-jwt extra")).toBeNull()
  expect(authorizationHeaderGetToken(null)).toBeNull()
})
