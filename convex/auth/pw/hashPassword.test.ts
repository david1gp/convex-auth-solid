import { expect, test } from "bun:test"
import { hashPassword, hashPassword2 } from "./hashPassword"
import { verifyHashedPassword, verifyHashedPassword2 } from "./verifyHashedPassword"

test("hashPassword produces a consistent hash for given password and salt", async () => {
  const password = "password123"
  const salt = "test-salt"

  const hash1 = await hashPassword(password, salt)
  const hash2 = await hashPassword(password, salt)

  expect(hash1).toBeDefined()
  expect(hash1).toHaveLength(64) // SHA-256 hex
  expect(hash1).toEqual(hash2)
})

test("hashPassword2 returns error when AUTH_SECRET is not defined", async () => {
  delete process.env.AUTH_SECRET

  const result = await hashPassword2("password123")

  expect(result.success).toBe(false)
})

test("hashPassword2 produces a hash when AUTH_SECRET is defined", async () => {
  const password = "password123"
  const salt = "test-salt"
  process.env.AUTH_SECRET = salt

  const result = await hashPassword2(password)

  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data).toHaveLength(64)
  }
})

test("verifyHashedPassword returns true for correct password and hash", async () => {
  const password = "password123"
  const salt = "test-salt"

  const hash = await hashPassword(password, salt)

  const isValid = await verifyHashedPassword(password, hash, salt)

  expect(isValid).toBe(true)
})

test("verifyHashedPassword returns false for incorrect password", async () => {
  const correctPassword = "password123"
  const wrongPassword = "wrongpassword"
  const salt = "test-salt"

  const hash = await hashPassword(correctPassword, salt)

  const isValid = await verifyHashedPassword(wrongPassword, hash, salt)

  expect(isValid).toBe(false)
})

test("verifyHashedPassword2 returns error when AUTH_SECRET is not defined", async () => {
  delete process.env.AUTH_SECRET

  const result = await verifyHashedPassword2("password123", "somehash")

  expect(result.success).toBe(false)
})

test("verifyHashedPassword2 returns true for correct password and hash", async () => {
  const password = "password123"
  const salt = "test-salt"
  process.env.AUTH_SECRET = salt

  const result1 = await hashPassword2(password)
  expect(result1.success).toBe(true)
  if (result1.success) {
    const hash = result1.data

    const result2 = await verifyHashedPassword2(password, hash)

    expect(result2.success).toBe(true)
    if (result2.success) {
      expect(result2.data).toBe(true)
    }
  }
})

test("verifyHashedPassword2 returns false for incorrect password", async () => {
  const correctPassword = "password123"
  const wrongPassword = "wrongpassword"
  const salt = "test-salt"
  process.env.AUTH_SECRET = salt

  const result1 = await hashPassword2(correctPassword)
  expect(result1.success).toBe(true)
  if (result1.success) {
    const hash = result1.data

    const result2 = await verifyHashedPassword2(wrongPassword, hash)

    expect(result2.success).toBe(true)
    if (result2.success) {
      expect(result2.data).toBe(false)
    }
  }
})
