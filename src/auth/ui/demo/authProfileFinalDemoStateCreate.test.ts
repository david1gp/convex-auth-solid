import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test"
import { createRoot } from "solid-js"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { uploadAreaImageStateCreate } from "#src/file/ui/upload_image/uploadAreaImageStateCreate.ts"
import { authProfileFinalDemoStateCreate } from "./authProfileFinalDemoStateCreate.ts"

const event = { preventDefault() {} } as SubmitEvent
const originalFetch = globalThis.fetch
const fetchSpy = mock(() => {
  throw Error("Demo must not fetch")
})
const uploadSpy = mock(async () => {
  throw Error("Demo must not upload")
})
const storageSpy = mock(() => {
  throw Error("Demo must not access session or local storage")
})
const storageDescriptors = ["sessionStorage", "localStorage"].map(
  (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
)
let dispose: () => void

beforeEach(() => {
  fetchSpy.mockClear()
  uploadSpy.mockClear()
  storageSpy.mockClear()
  globalThis.fetch = fetchSpy as unknown as typeof fetch
  for (const [key] of storageDescriptors) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: { getItem: storageSpy, setItem: storageSpy, removeItem: storageSpy },
    })
  }
})
afterEach(() => {
  expect(fetchSpy).not.toHaveBeenCalled()
  expect(uploadSpy).not.toHaveBeenCalled()
  expect(storageSpy).not.toHaveBeenCalled()
  dispose?.()
  pageDemoFixtureStoreGet().clear()
  globalThis.fetch = originalFetch
  for (const [key, descriptor] of storageDescriptors) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor)
    else Reflect.deleteProperty(globalThis, key)
  }
  mock.restore()
})

function stateCreate() {
  return createRoot((cleanup) => {
    dispose = cleanup
    return authProfileFinalDemoStateCreate()
  })
}

test("password steps require a requested demo code, validate input, and never store the password", async () => {
  const demo = stateCreate()
  const state = demo.passwordStateCreate()
  await state.confirm(event)
  expect(state.codeError()).toContain("6-digit")
  expect(state.passwordError()).toContain("12 characters")
  expect(state.step()).toBe(1)
  await state.request(event)
  expect(state.step()).toBe(2)
  expect(demo.message()).toContain("123456")
  state.codeInput("654321")
  state.passwordInput("demo-password-123456")
  await state.confirm(event)
  expect(state.message()).toContain("use 123456")
  expect(pageDemoFixtureStoreGet().has("auth.profile.passwordChanged")).toBe(false)
  state.codeInput("123456")
  await state.confirm(event)
  expect(pageDemoFixtureStoreGet().get<boolean>("auth.profile.passwordChanged")).toBe(true)
  expect(state.password()).toBe("")
  expect(demo.message()).toContain("No password or session")
  state.back()
  expect(state.step()).toBe(1)
})

test("password confirmation cannot bypass the local request step", async () => {
  const state = stateCreate().passwordStateCreate()
  state.codeInput("123456")
  state.passwordInput("demo-password-123456")
  await state.confirm(event)
  expect(state.message()).toContain("Send a demo code first")
  expect(pageDemoFixtureStoreGet().has("auth.profile.passwordChanged")).toBe(false)
})

test("email validation, back, and confirmation update the shared fixture across demo navigation", async () => {
  const demo = stateCreate()
  const state = demo.emailStateCreate()
  state.emailInput("not-an-email")
  await state.request(event)
  expect(state.emailError()).toContain("valid email")
  expect(state.passwordError()).toContain("required")
  expect(state.step()).toBe(1)
  state.passwordInput("local-current-password")
  state.emailInput("  changed@example.com  ")
  await state.request(event)
  expect(state.step()).toBe(2)
  expect(state.email()).toBe("changed@example.com")
  expect(state.password()).toBe("")
  state.codeInput("abcdef")
  await state.confirm(event)
  expect(state.codeError()).toContain("6-digit")
  state.codeInput("654321")
  await state.confirm(event)
  expect(state.message()).toContain("use 123456")
  expect(demo.publicProfile().email).toBe("alex@example.com")
  state.codeInput("123456")
  await state.confirm(event)
  const nextDemo = authProfileFinalDemoStateCreate()
  expect(nextDemo.publicProfile().email).toBe("changed@example.com")
  expect(nextDemo.publicProfile().username).toBe("sample-user")
  expect(nextDemo.publicProfile().createdAt).toBe("2026-01-15T10:00:00.000Z")
  expect(demo.message()).toContain("No account or session")
  state.back()
  expect(state.step()).toBe(1)
})

test("an email request survives demo navigation without saving the current password", async () => {
  const first = stateCreate().emailStateCreate()
  first.emailInput("pending@example.com")
  first.passwordInput("not-persisted")
  await first.request(event)
  const next = authProfileFinalDemoStateCreate().emailStateCreate()
  expect(next.email()).toBe("pending@example.com")
  expect(next.password()).toBe("")
  next.codeInput("123456")
  await next.confirm(event)
  expect(authProfileFinalDemoStateCreate().publicProfile().email).toBe("pending@example.com")
})

test("the actual image picker seam previews and removes a local file without uploading", async () => {
  const demo = stateCreate()
  const state = demo.imageStateCreate()
  const picker = uploadAreaImageStateCreate(
    {
      hasUploaded: state.hasUploaded,
      info: state.uploadInfo,
      error: state.uploadError,
      onUploadSuccess: state.uploadSuccess,
      onFileSelect: state.selectFile,
    },
    uploadSpy,
    () => "Only image files are allowed",
  )
  const file = new File(["local image bytes"], "demo.png", { type: "image/png" })
  await picker.fileChange({ currentTarget: { files: [file] } } as unknown as Parameters<typeof picker.fileChange>[0])
  expect(state.image()).toStartWith("blob:")
  expect(authProfileFinalDemoStateCreate().publicProfile().image).toBe(state.image())
  expect(demo.message()).toContain("No file was uploaded")
  const revoke = spyOn(URL, "revokeObjectURL")
  const image = state.image()
  await state.remove()
  expect(revoke).toHaveBeenCalledWith(image)
  expect(state.hasImage()).toBe(false)
  expect(authProfileFinalDemoStateCreate().publicProfile().image).toBeUndefined()
})

test("non-image selection is rejected by the picker before either preview or upload", async () => {
  const state = stateCreate().imageStateCreate()
  const localSelect = mock(state.selectFile!)
  const picker = uploadAreaImageStateCreate(
    {
      hasUploaded: state.hasUploaded,
      info: state.uploadInfo,
      error: state.uploadError,
      onFileSelect: localSelect,
    },
    uploadSpy,
    () => "Only image files are allowed",
  )
  const file = new File(["text"], "demo.txt", { type: "text/plain" })
  await picker.fileChange({ currentTarget: { files: [file] } } as unknown as Parameters<typeof picker.fileChange>[0])
  expect(localSelect).not.toHaveBeenCalled()
  expect(state.uploadError.get()).toBeTruthy()
  expect(state.hasImage()).toBe(false)
})

test("deletion confirms locally once and leaves the fixture and real sessions intact", async () => {
  const demo = stateCreate()
  const state = demo.deleteStateCreate()
  const profile = demo.publicProfile()
  await state.remove()
  expect(state.deleted()).toBe(true)
  expect(pageDemoFixtureStoreGet().get<boolean>("auth.profile.deleted")).toBe(true)
  expect(demo.message()).toContain("no account or session was deleted")
  await state.remove()
  expect(authProfileFinalDemoStateCreate().publicProfile()).toEqual(profile)
  expect(authProfileFinalDemoStateCreate().deleteStateCreate().deleted()).toBe(true)
})
