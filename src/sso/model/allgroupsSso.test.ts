import { describe, expect, it } from "bun:test"
import { allgroupsLocalStorageRead } from "./allgroupsLocalStorageRead.ts"
import { allgroupsSsoAttemptRecord } from "./allgroupsSsoAttemptRecord.ts"
import { allgroupsSsoAttemptsExhaust } from "./allgroupsSsoAttemptsExhaust.ts"
import { allgroupsSsoAttemptsRead } from "./allgroupsSsoAttemptsRead.ts"
import { allgroupsSsoAttemptsReset } from "./allgroupsSsoAttemptsReset.ts"
import { allgroupsSsoPreferenceRead } from "./allgroupsSsoPreferenceRead.ts"
import { allgroupsSsoPreferenceWrite } from "./allgroupsSsoPreferenceWrite.ts"
import { allgroupsSsoReturnToResolve } from "./allgroupsSsoReturnToResolve.ts"
import { allgroupsSsoStorageKeys } from "./allgroupsSsoStorageKeys.ts"

class MemoryStorage implements Storage {
  private items = new Map<string, string>()

  get length(): number {
    return this.items.size
  }

  clear(): void {
    this.items.clear()
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null
  }

  key(index: number): string | null {
    return Array.from(this.items.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.items.delete(key)
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value)
  }
}

describe("allgroups SSO state and semantics", () => {
  it("defaults preference to false when storage is empty or invalid", () => {
    const storage = new MemoryStorage()
    expect(allgroupsSsoPreferenceRead(storage)).toBe(false)

    storage.setItem(allgroupsSsoStorageKeys.preference, "not-json")
    expect(allgroupsSsoPreferenceRead(storage)).toBe(false)

    storage.setItem(allgroupsSsoStorageKeys.preference, JSON.stringify("unexpected-string"))
    expect(allgroupsSsoPreferenceRead(storage)).toBe(false)
  })

  it("persists preference as JSON boolean and resets attempt budget", () => {
    const storage = new MemoryStorage()
    storage.setItem(allgroupsSsoStorageKeys.attempts, "2")

    const result = allgroupsSsoPreferenceWrite(true, storage)
    expect(result.success).toBe(true)
    expect(storage.getItem(allgroupsSsoStorageKeys.preference)).toBe("true")
    expect(allgroupsSsoPreferenceRead(storage)).toBe(true)
    expect(storage.getItem(allgroupsSsoStorageKeys.attempts)).toBeNull()
  })

  it("reports attempt reset failures to the preference caller", () => {
    const storage = {
      length: 0,
      clear: () => {},
      getItem: () => null,
      key: () => null,
      removeItem: () => {
        throw new Error("SecurityError")
      },
      setItem: () => {},
    } as unknown as Storage

    const result = allgroupsSsoPreferenceWrite(true, storage)

    expect(result.success).toBe(false)
    if (!result.success) expect(result.op).toBe("allgroupsSsoAttemptsReset")
  })

  it("limits automatic sign-in attempts to max three and pauses afterwards", () => {
    const storage = new MemoryStorage()

    const attempt1 = allgroupsSsoAttemptRecord(storage)
    expect(attempt1.success).toBe(true)
    if (attempt1.success) {
      expect(attempt1.data.allowed).toBe(true)
      expect(attempt1.data.attempts).toBe(1)
    }

    const attempt2 = allgroupsSsoAttemptRecord(storage)
    expect(attempt2.success).toBe(true)
    if (attempt2.success) {
      expect(attempt2.data.allowed).toBe(true)
      expect(attempt2.data.attempts).toBe(2)
    }

    const attempt3 = allgroupsSsoAttemptRecord(storage)
    expect(attempt3.success).toBe(true)
    if (attempt3.success) {
      expect(attempt3.data.allowed).toBe(true)
      expect(attempt3.data.attempts).toBe(3)
    }

    const attempt4 = allgroupsSsoAttemptRecord(storage)
    expect(attempt4.success).toBe(true)
    if (attempt4.success) {
      expect(attempt4.data.allowed).toBe(false)
      expect(attempt4.data.attempts).toBe(3)
    }
  })

  it("exhausts attempts on deliberate logout", () => {
    const storage = new MemoryStorage()
    const exhaustResult = allgroupsSsoAttemptsExhaust(storage)
    expect(exhaustResult.success).toBe(true)
    expect(allgroupsSsoAttemptsRead(storage)).toBe(3)

    const nextAttempt = allgroupsSsoAttemptRecord(storage)
    expect(nextAttempt.success).toBe(true)
    if (nextAttempt.success) {
      expect(nextAttempt.data.allowed).toBe(false)
    }
  })

  it("resets attempts counter correctly", () => {
    const storage = new MemoryStorage()
    allgroupsSsoAttemptsExhaust(storage)
    expect(allgroupsSsoAttemptsRead(storage)).toBe(3)

    allgroupsSsoAttemptsReset(storage)
    expect(allgroupsSsoAttemptsRead(storage)).toBe(0)
  })

  it("safely resolves return destinations without /sso loops", () => {
    expect(allgroupsSsoReturnToResolve(undefined)).toBe("/overview")
    expect(allgroupsSsoReturnToResolve("")).toBe("/overview")
    expect(allgroupsSsoReturnToResolve("/sso")).toBe("/overview")
    expect(allgroupsSsoReturnToResolve("/sso?returnTo=/app")).toBe("/overview")
    expect(allgroupsSsoReturnToResolve("/sso/subpath")).toBe("/overview")
    expect(allgroupsSsoReturnToResolve("https://malicious.example.com")).toBe("/overview")
    expect(allgroupsSsoReturnToResolve("//malicious.example.com")).toBe("/overview")
    expect(allgroupsSsoReturnToResolve("/app")).toBe("/app")
    expect(allgroupsSsoReturnToResolve("/app/groups?city=berlin#top")).toBe("/app/groups?city=berlin#top")
  })

  it("gracefully handles storage failures without throwing", () => {
    const throwingStorage = {
      length: 0,
      clear: () => {},
      getItem: () => {
        throw new Error("QuotaExceededError")
      },
      key: () => null,
      removeItem: () => {
        throw new Error("SecurityError")
      },
      setItem: () => {
        throw new Error("QuotaExceededError")
      },
    } as unknown as Storage

    expect(allgroupsSsoPreferenceRead(throwingStorage)).toBe(false)
    expect(allgroupsSsoAttemptsRead(throwingStorage)).toBe(0)

    const writeResult = allgroupsSsoPreferenceWrite(true, throwingStorage)
    expect(writeResult.success).toBe(false)

    const recordResult = allgroupsSsoAttemptRecord(throwingStorage)
    expect(recordResult.success).toBe(false)
  })
})
