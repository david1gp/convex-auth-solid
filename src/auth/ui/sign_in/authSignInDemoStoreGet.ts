import { createSignalObject } from "#ui/utils/createSignalObject.ts"

// In-memory only: no auth client, URL state, persistence or network requests.
const store = {
  email: createSignalObject("demo@example.com"),
  message: createSignalObject(""),
}

export function authSignInDemoStoreGet() {
  return store
}
