import { describe, expect, test } from "bun:test"
import * as a from "valibot"
import { cachePrefix } from "#src/utils/ui/cachePrefix.ts"
import { paginationPageCacheLoad } from "./paginationPageCacheLoad.ts"
import { paginationPageCacheSave } from "./paginationPageCacheSave.ts"

class MemoryStorage implements Storage {
  private values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

const schema = a.object({
  page: a.array(a.string()),
  isDone: a.boolean(),
  continueCursor: a.string(),
})

describe("pagination page cache", () => {
  test("saves and loads only schema-valid pages", () => {
    const storage = new MemoryStorage()
    const value = { page: ["one"], isDone: false, continueCursor: "cursor-1" }
    const saved = paginationPageCacheSave("members/page-1", value, schema, storage)

    expect(saved.success).toBe(true)
    expect(paginationPageCacheLoad("members/page-1", schema, storage)).toEqual({ success: true, data: value })
    expect(storage.getItem(`${cachePrefix}members/page-1`)).not.toBeNull()
  })

  test("ignores invalid cached pages", () => {
    const storage = new MemoryStorage()
    storage.setItem(`${cachePrefix}members/page-1`, JSON.stringify({ page: [1], isDone: false }))

    expect(paginationPageCacheLoad("members/page-1", schema, storage)).toBeUndefined()
  })
})
