/** Creates an in-memory fixture store. Values live only as long as this store instance. */
export function pageDemoFixtureStoreCreate() {
  const fixtures = new Map<string, unknown>()

  return {
    get<T>(key: string): T | undefined {
      return fixtures.get(key) as T | undefined
    },
    has(key: string) {
      return fixtures.has(key)
    },
    set<T>(key: string, value: T) {
      fixtures.set(key, value)
      return value
    },
    update<T>(key: string, update: (current: T | undefined) => T) {
      const next = update(fixtures.get(key) as T | undefined)
      fixtures.set(key, next)
      return next
    },
    delete(key: string) {
      return fixtures.delete(key)
    },
    clear() {
      fixtures.clear()
    },
  }
}
