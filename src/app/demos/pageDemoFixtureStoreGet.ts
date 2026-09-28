import { pageDemoFixtureStoreCreate } from "#src/app/demos/pageDemoFixtureStoreCreate.ts"

// Module lifetime spans client-side navigation but ends on a full page reload.
const pageDemoFixtureStore = pageDemoFixtureStoreCreate()

export function pageDemoFixtureStoreGet() {
  return pageDemoFixtureStore
}
