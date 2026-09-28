import { expect, test } from "bun:test"
import * as a from "valibot"
import { apiKeyCredentialGenerate } from "./apiKeyCredentialGenerate.js"
import { apiKeyCredentialHash } from "./apiKeyCredentialHash.js"
import { apiKeyCredentialMask } from "./apiKeyCredentialMask.js"
import { apiKeyExpiresAtCreate } from "./apiKeyExpiresAtCreate.js"
import { apiKeyExpiryPresetSchema } from "./apiKeyExpiryPreset.js"

test("generated API credentials have 256 random bits and random-looking preview ends", () => {
  const credential = apiKeyCredentialGenerate()

  expect(credential.credential).toMatch(/^[0-9a-f]{64}$/)
  expect(credential.previewFirst3).toBe(credential.credential.slice(0, 3))
  expect(credential.previewLast3).toBe(credential.credential.slice(-3))
})

test("credential digest matches the SHA-256 known vector", async () => {
  expect(await apiKeyCredentialHash("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
})

test("different credentials have different SHA-256 digests", async () => {
  expect(await apiKeyCredentialHash("abc")).not.toBe(await apiKeyCredentialHash("abd"))
})

test("credential digests are deterministic and do not equal plaintext", async () => {
  const credential = apiKeyCredentialGenerate().credential
  const digest = await apiKeyCredentialHash(credential)

  expect(digest).toHaveLength(64)
  expect(digest).toBe(await apiKeyCredentialHash(credential))
  expect(digest).not.toBe(credential)
})

test("masked credential preview exposes only its first and last three characters", () => {
  expect(apiKeyCredentialMask("a1b", "x9z")).toBe("a1b••••••x9z")
})

test("masked credential preview does not expose the middle of a full generated credential", () => {
  const full = "abc" + "secret-middle" + "xyz"
  const masked = apiKeyCredentialMask(full.slice(0, 3), full.slice(-3))
  expect(masked).toBe("abc••••••xyz")
  expect(masked).not.toContain("secret-middle")
})

test("masked credential preview preserves zeros and repeated boundary characters", () => {
  expect(apiKeyCredentialMask("000", "000")).toBe("000••••••000")
})

test("masked credential preview still hides the center when a preview end is empty", () => {
  expect(apiKeyCredentialMask("", "xyz")).toBe("••••••xyz")
  expect(apiKeyCredentialMask("abc", "")).toBe("abc••••••")
})

test("expiry presets validate supported choices and create absolute expiry dates", () => {
  const nowMs = Date.UTC(2026, 0, 1)

  expect(a.safeParse(apiKeyExpiryPresetSchema, "1-week").success).toBe(true)
  expect(a.safeParse(apiKeyExpiryPresetSchema, "2-months").success).toBe(false)
  expect(apiKeyExpiresAtCreate("1-day", nowMs)).toBe(new Date(nowMs + 24 * 60 * 60 * 1000).toISOString())
  expect(apiKeyExpiresAtCreate(undefined, nowMs)).toBe(new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString())
  expect(apiKeyExpiresAtCreate("never", nowMs)).toBeUndefined()
})
