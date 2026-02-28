import type { FileModel } from "@/file/model/FileModel"
import { uploadStatus, type UploadStatus } from "@/file/model_field/uploadStatus"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { UploadFileStats } from "@/file/ui/stats/UploadFileStats"
import { UploadAreaFileView } from "@/file/ui/upload_file/UploadAreaFileView"
import { uploadHandlerFile } from "@/file/ui/upload_file/uploadHandlerFile"
import type { MayHaveResourceId } from "@/resource/model/MayHaveResourceId"
import { Show, type Accessor, type JSX } from "solid-js"
import { classMerge } from "~ui/utils/classMerge"
import type { SignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveId } from "~ui/utils/MayHaveId"
import { generateId12 } from "~utils/ran/generateId12"

export interface UploadAreaFileProps extends MayHaveResourceId, MayHaveClass, MayHaveId {
  hasUploaded: Accessor<boolean>
  info: SignalObject<UploadAreaFileInfo | null>
  error?: SignalObject<string | null>
  handler?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>
  accept?: string
  onUploadSuccess?: (file: FileModel) => void
}

export function UploadAreaFile(p: UploadAreaFileProps) {
  if (!p.id) p.id = generateId12()

  const handler = p.handler ?? createFileChangeHandler(p)

  const getCurrentStatus = () => getUploadStatus(p.error?.get() ?? null, p.info.get(), p.hasUploaded())

  return (
    <>
      <label for={p.id} class={classMerge("flex cursor-pointer flex-col items-center", p.class)}>
        <UploadAreaFileView status={getCurrentStatus()} error={p.error?.get()} info={p.info.get()} />
      </label>
      <input id={p.id} type="file" accept={p.accept} class="hidden" onChange={handler} />
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

function createFileChangeHandler(p: UploadAreaFileProps): JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> {
  return async (e) => {
    const files = e.currentTarget.files
    if (!files || !files[0]) return

    const file = files[0]

    await uploadHandlerFile({
      file,
      uploadInfo: p.info,
      uploadError: p.error,
      resourceId: p.resourceId,
      onUploadSuccess: p.onUploadSuccess,
    })
  }
}
