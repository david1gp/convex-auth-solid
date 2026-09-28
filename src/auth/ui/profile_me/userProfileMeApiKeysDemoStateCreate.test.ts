import { afterAll, afterEach, beforeAll, describe, expect, test } from "bun:test"
import { createRoot } from "solid-js"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import type { ApiKeyListItem } from "#src/auth/model/apiKeyListItemSchema.ts"
import { userProfileMeApiKeysDemoStateCreate } from "./userProfileMeApiKeysDemoStateCreate.ts"

const submit = { preventDefault: () => {} } as SubmitEvent
const originalStorage = globalThis.localStorage
beforeAll(() => {
  globalThis.localStorage = { getItem: () => null } as unknown as Storage
})
afterAll(() => {
  globalThis.localStorage = originalStorage
})
afterEach(() => pageDemoFixtureStoreGet().clear())

describe("API key page demo state", () => {
  test("creates locally with optional expiry, a masked listing and a one-time secret", async () => {
    const originalFetch = globalThis.fetch
    let requests = 0
    globalThis.fetch = (() => {
      requests += 1
      throw new Error("unexpected network call")
    }) as unknown as typeof fetch
    const dispose = createRoot((disposeRoot) => {
      const state = userProfileMeApiKeysDemoStateCreate({ now: () => Date.parse("2026-09-28T10:00:00.000Z") })
      return { state, disposeRoot }
    })
    try {
      const { state } = dispose
      expect(state.page()?.page.map((key) => key.name)).toEqual(["Sample integration", "Retired integration"])
      state.nameChange("  ")
      await state.create(submit)
      expect(state.error()).toContain("Name")
      expect(state.page()?.page).toHaveLength(2)

      state.nameChange("  CI key  ")
      state.expiryChange("never")
      await state.create(submit)
      const secret = state.credential()
      expect(secret).toStartWith("demo_key_")
      expect(state.page()?.page[0]).toMatchObject({
        name: "CI key",
        status: "active",
        maskedCredential: "dem••••••003",
      })
      expect(state.page()?.page[0]?.expiresAt).toBeUndefined()
      expect(state.page()?.page[0]?.maskedCredential).not.toContain(secret)
      state.nameChange("blocked")
      await state.create(submit)
      expect(state.page()?.page).toHaveLength(3)
      state.dismiss()
      expect(state.credential()).toBe("")
      expect(state.page()?.page[0]?.maskedCredential).not.toContain(secret)

      state.expiryChange("1-day")
      state.nameChange("Expiring key")
      await state.create(submit)
      expect(state.page()?.page[0]?.expiresAt).toBe("2026-09-29T10:00:00.000Z")
      expect(requests).toBe(0)
    } finally {
      dispose.disposeRoot()
      globalThis.fetch = originalFetch
    }
  })

  test("revokes and rotates only active keys, preserving expiry without revealing old secrets", async () => {
    let accept = false
    const { state, dispose } = createRoot((disposeRoot) => ({
      state: userProfileMeApiKeysDemoStateCreate({
        now: () => Date.parse("2026-09-28T12:00:00.000Z"),
        confirm: () => accept,
      }),
      dispose: disposeRoot,
    }))
    try {
      const active = state.page()!.page[0]!
      await state.revoke(active)
      expect(state.page()!.page[0]!.status).toBe("active")
      accept = true
      await state.rotate(active)
      expect(state.page()!.page[0]!.name).toBe(active.name)
      expect(state.page()!.page[0]!.id).not.toBe(active.id)
      expect(state.page()!.page.find((key) => key.id === active.id)?.status).toBe("revoked")
      const rotatedSecret = state.credential()
      expect(rotatedSecret).toStartWith("demo_key_")
      await state.revoke(state.page()!.page[0]!)
      expect(state.page()!.page[0]!.status).toBe("active")
      state.dismiss()
      await state.revoke(state.page()!.page[0]!)
      expect(state.page()!.page[0]!.status).toBe("revoked")
      await state.rotate(active)
      expect(state.credential()).toBe("")
      expect(state.page()!.page).toHaveLength(3)
    } finally {
      dispose()
    }
  })

  test("paginates shared fixtures in memory", async () => {
    const { state, dispose } = createRoot((disposeRoot) => ({
      state: userProfileMeApiKeysDemoStateCreate(),
      dispose: disposeRoot,
    }))
    try {
      for (let i = 0; i < 5; i++) {
        state.nameChange(`Key ${i}`)
        await state.create(submit)
        state.dismiss()
      }
      expect(state.pageNumber()).toBe(1)
      expect(state.page()?.page).toHaveLength(5)
      expect(state.canNext()).toBe(true)
      state.next()
      expect(state.pageNumber()).toBe(2)
      expect(state.page()?.page).toHaveLength(2)
      expect(state.canPrevious()).toBe(true)
      state.previous()
      expect(state.pageNumber()).toBe(1)
    } finally {
      dispose()
    }
  })

  test("preserves key mutations and sequence across remounts without persisting plaintext secrets", async () => {
    const first = createRoot((dispose) => ({
      state: userProfileMeApiKeysDemoStateCreate({ confirm: () => true }),
      dispose,
    }))
    first.state.nameChange("Persistent key")
    await first.state.create(submit)
    const secret = first.state.credential()
    const createdKey = first.state.page()!.page[0]!
    first.state.dismiss()
    await first.state.revoke(createdKey)
    first.dispose()

    const storedFixture = pageDemoFixtureStoreGet().get<{
      get: () => { keys: ApiKeyListItem[]; sequence: number }
    }>("auth:api-keys")!
    expect(JSON.stringify(storedFixture.get())).not.toContain(secret)

    const second = createRoot((dispose) => ({ state: userProfileMeApiKeysDemoStateCreate(), dispose }))
    try {
      expect(second.state.credential()).toBe("")
      expect(second.state.page()!.page.find((key) => key.id === createdKey.id)?.status).toBe("revoked")
      second.state.nameChange("Next key")
      await second.state.create(submit)
      expect(String(second.state.page()!.page[0]!.id)).toBe("demo-key-4")
      expect(second.state.credential()).not.toBe(secret)
    } finally {
      second.dispose()
    }
  })

  test("treats elapsed expiry as expired and rejects rotation or revocation", async () => {
    let now = Date.parse("2026-09-28T10:00:00.000Z")
    const { state, dispose } = createRoot((disposeRoot) => ({
      state: userProfileMeApiKeysDemoStateCreate({ now: () => now, confirm: () => true }),
      dispose: disposeRoot,
    }))
    try {
      state.nameChange("Short-lived")
      state.expiryChange("1-day")
      await state.create(submit)
      state.dismiss()
      const key = state.page()!.page[0]!
      now += 2 * 24 * 60 * 60 * 1000
      expect(state.page()!.page[0]!.status).toBe("expired")
      await state.rotate(key)
      await state.revoke(key)
      expect(state.page()!.page).toHaveLength(3)
      expect(state.credential()).toBe("")
    } finally {
      dispose()
    }
  })
})
