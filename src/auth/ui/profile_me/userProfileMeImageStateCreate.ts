import type { Result } from "#result"
import type { UploadAreaFileInfo } from "#src/file/ui/stats/UploadAreaFileInfo.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function userProfileMeImageStateCreate(actions: {
  initialImage: string
  save: (image: string) => Promise<Result<unknown>>
  selectFile?: (file: File) => Promise<Result<string>>
  saveOnRemove?: boolean
}) {
  const image = createSignalObject(actions.initialImage)
  const uploadInfo = createSignalObject<UploadAreaFileInfo | null>(null)
  const uploadError = createSignalObject<string | null>(null)
  const loading = createSignalObject(false)
  const message = createSignalObject("")

  async function save() {
    if (loading.get()) return
    loading.set(true)
    const result = await actions.save(image.get())
    loading.set(false)
    if (!result.success) {
      message.set(result.errorMessage)
      return
    }
    message.set("Profile Image Updated")
  }

  async function uploadSuccess(data: { url: string }) {
    image.set(data.url)
    await save()
  }

  async function selectFile(file: File) {
    if (!actions.selectFile || loading.get()) return
    uploadError.set(null)
    const result = await actions.selectFile(file)
    if (!result.success) {
      uploadError.set(result.errorMessage)
      return
    }
    await uploadSuccess({ url: result.data })
  }

  async function remove() {
    if (loading.get()) return
    image.set("")
    if (actions.saveOnRemove) await save()
  }

  return {
    image: image.get,
    hasImage: () => !!image.get(),
    hasUploaded: () => !!uploadInfo.get(),
    uploadInfo,
    uploadError,
    loading: loading.get,
    message: message.get,
    remove,
    uploadSuccess,
    selectFile: actions.selectFile ? selectFile : undefined,
  }
}
