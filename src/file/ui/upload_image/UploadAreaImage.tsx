import type { FileModel } from "@/file/model/FileModel"
import { uploadImageTexts, uploadStatus, type UploadStatus } from "@/file/model_field/uploadStatus"
import { UploadFileStats } from "@/file/ui/stats/UploadFileStats"
import { UploadAreaImageView } from "@/file/ui/upload_image/UploadAreaImageView"
import { uploadHandlerImage } from "@/file/ui/upload_image/uploadHandlerImage"
import type { MayHaveResourceId } from "@/resource/model/MayHaveResourceId"
import { Show, type Accessor, type JSX } from "solid-js"
import { classMerge } from "~ui/utils/classMerge"
import type { SignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveId } from "~ui/utils/MayHaveId"
import { generateId12 } from "~utils/ran/generateId12"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"

export interface UploadAreaImageProps extends MayHaveResourceId, MayHaveId, MayHaveClass {
  hasUploaded: Accessor<boolean>
  info: SignalObject<UploadAreaFileInfo | null>
  error?: SignalObject<string | null>
  onUploadSuccess?: (file: FileModel) => void
}

export function UploadAreaImage(p: UploadAreaImageProps) {
  if (!p.id) p.id = generateId12()

  const fileChangeHandler = createFileChangeHandler(p)

  const getCurrentStatus = () => getUploadStatus(p.error?.get() ?? null, p.info.get(), p.hasUploaded())

  return (
    <>
      <label for={p.id} class={classMerge("flex cursor-pointer flex-col items-center", p.class)}>
        <UploadAreaImageView status={getCurrentStatus()} error={p.error?.get()} info={p.info.get()} />
      </label>
      <input id={p.id} type="file" accept="image/*" class="hidden" onChange={fileChangeHandler} />
      <Show when={p.info.get()}>
        <UploadFileStats info={p.info.get()!} />
      </Show>
    </>
  )
}

function getUploadStatus(error: string | null, info: UploadAreaFileInfo | null, hasUploaded: boolean): UploadStatus {
  if (error) return uploadStatus.error
  if (info) return uploadStatus.uploading
  if (hasUploaded) return uploadStatus.uploaded
  return uploadStatus.empty
}

function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: uploadImageTexts.onlyImages() }
  }
  return { isValid: true }
}

function createFileChangeHandler(p: UploadAreaImageProps): JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> {
  return async (e) => {
    const files = e.currentTarget.files
    if (!files || !files[0]) return

    const file = files[0]
    const validation = validateImageFile(file)

    if (!validation.isValid) {
      p.error?.set(validation.error!)
      return
    }

    await uploadHandlerImage({
      resourceId: p.resourceId,
      file,
      uploadInfo: p.info,
      uploadError: p.error,
      onUploadSuccess: p.onUploadSuccess,
    })
  }
}
