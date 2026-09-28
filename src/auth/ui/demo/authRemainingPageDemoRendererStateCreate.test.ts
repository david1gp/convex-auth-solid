import { afterEach, expect, mock, test } from "bun:test"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { userProfileMeEditFormStateManagement } from "#src/auth/ui/profile_me/userProfileMeEditFormState.ts"
import { signUpDemoStateCreate } from "#src/auth/ui/sign_up/form/signUpDemoStateCreate.ts"
import { signUpPageContentStateCreate } from "#src/auth/ui/sign_up/signUpPageContentStateCreate.ts"
import { allgroupsSsoDemoStateCreate } from "#src/sso/ui/allgroupsSsoDemoStateCreate.ts"
import { authRemainingPageDemoRendererStateCreate } from "./authRemainingPageDemoRendererStateCreate.ts"

const originalFetch = globalThis.fetch
afterEach(() => {
  pageDemoFixtureStoreGet().clear()
  globalThis.fetch = originalFetch
})

test("valid demo sign-up reveals the confirmation link with the saved email and no network request", async () => {
  const fetchSpy = mock(() => {
    throw Error("Demo must not fetch")
  })
  globalThis.fetch = fetchSpy as unknown as typeof fetch
  const renderer = authRemainingPageDemoRendererStateCreate()
  const confirmHref = pageDemoHref("/sign-up-confirm-email")
  const page = signUpPageContentStateCreate(() => ({
    demo: true,
    confirmHref,
    message: renderer.signUpMessage(),
  }))
  const form = signUpDemoStateCreate()
  expect(page.confirmHref()).toBeUndefined()
  form.state.name.set("Alex Example")
  form.state.email.set("alex@example.com")
  form.state.pw.set("a-very-long-password-123")
  form.handleSubmit({ preventDefault() {} } as SubmitEvent)
  expect(form.errors.terms.get()).not.toBe("")
  expect(page.confirmHref()).toBeUndefined()
  form.state.terms.set(true)
  form.handleSubmit({ preventDefault() {} } as SubmitEvent)
  expect(page.confirmHref()).toBe("/demos/pages/sign-up-confirm-email")
  expect(renderer.signUpMessage()).toContain("No account")
  expect(form.state.pw.get()).toBe("")
  const confirmation = authRemainingPageDemoRendererStateCreate()
  expect(confirmation.email()).toBe("alex@example.com")
  await confirmation.confirm("123456", confirmation.email())
  expect(confirmation.message()).toContain("No email was verified")
  expect(fetchSpy).not.toHaveBeenCalled()
})

test("profile edits update only the in-memory demo profile", () => {
  const fetchSpy = mock(() => {
    throw Error("Demo must not fetch")
  })
  globalThis.fetch = fetchSpy as unknown as typeof fetch
  const renderer = authRemainingPageDemoRendererStateCreate()
  const sm = userProfileMeEditFormStateManagement({ name: "Alex Example", bio: "", url: "" })
  sm.state.name.set("New Demo Name")
  renderer.profile.save(sm)
  expect(renderer.profile.profile().name).toBe("New Demo Name")
  expect(authRemainingPageDemoRendererStateCreate().profile.profile().name).toBe("New Demo Name")
  expect(fetchSpy).not.toHaveBeenCalled()
})

test("SSO demo never redirects, stores a preference, or starts authentication", () => {
  const state = allgroupsSsoDemoStateCreate()
  state.autoSignInToggle(true)
  state.loginClick()
  expect(state.autoSignIn()).toBe(true)
  expect(state.errorMessage()).toContain("no identity provider")
})
