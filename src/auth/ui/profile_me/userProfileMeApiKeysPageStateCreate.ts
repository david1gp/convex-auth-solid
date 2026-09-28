import { onCleanup } from "solid-js"
import * as a from "valibot"
import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { type ApiKeyExpiryPreset, apiKeyExpiryPresetSchema } from "#src/auth/model/apiKeyExpiryPreset.ts"
import { type ApiKeyListItem, apiKeyListItemSchema } from "#src/auth/model/apiKeyListItemSchema.ts"
import { apiKeyNameSchema } from "#src/auth/model/apiKeyNameSchema.ts"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"
import { mutationCreate } from "#src/utils/convex_client/mutationCreate.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function userProfileMeApiKeysPageStateCreate() {
  const pagination = cursorPaginationCreate({
    query: api.auth.apiKeyListQuery,
    queryKey: "apiKeyListQuery",
    args: () => ({ token: userTokenGet() }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    itemSchema: apiKeyListItemSchema,
  })
  const createMutation = mutationCreate(api.auth.apiKeyCreateMutation)
  const revokeMutation = mutationCreate(api.auth.apiKeyRevokeMutation)
  const rotateMutation = mutationCreate(api.auth.apiKeyRotateMutation)
  const name = createSignalObject("")
  const expiryPreset = createSignalObject<ApiKeyExpiryPreset>("1-month")
  const credential = createSignalObject("")
  const busy = createSignalObject(false)
  const error = createSignalObject("")
  let mounted = true

  onCleanup(() => {
    mounted = false
    credential.set("")
  })

  async function create(e: SubmitEvent) {
    e.preventDefault()
    if (busy.get() || credential.get()) return
    const parsed = a.safeParse(apiKeyNameSchema, name.get())
    if (!parsed.success) {
      error.set(ttc("Name must be 1–80 characters"))
      return
    }
    busy.set(true)
    error.set("")
    try {
      const result = await createMutation({
        token: userTokenGet(),
        name: parsed.output,
        expiryPreset: expiryPreset.get(),
      })
      if (!mounted) return
      if (!result.success) {
        error.set(ttc("Could not create API key"))
        return
      }
      name.set("")
      credential.set(result.data.credential)
      pagination.reset()
    } catch {
      error.set(ttc("Could not create API key"))
    } finally {
      busy.set(false)
    }
  }

  async function revoke(key: ApiKeyListItem) {
    if (busy.get() || credential.get() || !window.confirm(ttc("Revoke this API key? This cannot be undone."))) return
    busy.set(true)
    error.set("")
    try {
      const result = await revokeMutation({ token: userTokenGet(), id: key.id })
      if (!result.success) error.set(ttc("Could not revoke API key"))
      else pagination.reset()
    } catch {
      error.set(ttc("Could not revoke API key"))
    } finally {
      busy.set(false)
    }
  }

  async function rotate(key: ApiKeyListItem) {
    if (
      busy.get() ||
      credential.get() ||
      !window.confirm(ttc("Rotate this API key? The old credential will stop working immediately."))
    )
      return
    busy.set(true)
    error.set("")
    try {
      const result = await rotateMutation({ token: userTokenGet(), id: key.id })
      if (!mounted) return
      if (!result.success) {
        error.set(ttc("Could not rotate API key"))
        return
      }
      credential.set(result.data.credential)
      pagination.reset()
    } catch {
      error.set(ttc("Could not rotate API key"))
    } finally {
      busy.set(false)
    }
  }

  async function copy() {
    const value = credential.get()
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      toastAdd({ title: ttc("API key copied"), variant: toastVariant.success })
    } catch {
      toastAdd({ title: ttc("Could not copy API key"), variant: toastVariant.error })
    }
  }

  return {
    pageNumber: () => pagination.history().length + 1,
    canPrevious: pagination.canPrevious,
    canNext: pagination.canNext,
    previous: pagination.previous,
    next: pagination.next,
    loading: pagination.loading,
    page: () => {
      const result = pagination.page()
      return result?.success ? result.data : undefined
    },
    listError: () => {
      const result = pagination.page()
      return result && !result.success ? ttc("Could not load API keys") : ""
    },
    name: name.get,
    nameChange: name.set,
    expiryPreset: expiryPreset.get,
    expiryChange: (value: string) => {
      const parsed = a.safeParse(apiKeyExpiryPresetSchema, value)
      if (parsed.success) expiryPreset.set(parsed.output)
    },
    credential: credential.get,
    dismiss: () => credential.set(""),
    busy: busy.get,
    error: error.get,
    create,
    revoke,
    rotate,
    copy,
  }
}
