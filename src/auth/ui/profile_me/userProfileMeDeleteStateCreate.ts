import type { Result } from "#result"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function userProfileMeDeleteStateCreate(removeAccount: () => Promise<Result<unknown>>, initialDeleted = false) {
  const deleting = createSignalObject(false)
  const deleted = createSignalObject(initialDeleted)
  const message = createSignalObject(initialDeleted ? "Account deleted successfully" : "")
  async function remove() {
    if (deleting.get() || deleted.get()) return
    deleting.set(true)
    const result = await removeAccount()
    deleting.set(false)
    if (!result.success) {
      message.set(result.errorMessage)
      return
    }
    deleted.set(true)
    message.set("Account deleted successfully")
  }
  return { deleting: deleting.get, deleted: deleted.get, message: message.get, remove }
}
