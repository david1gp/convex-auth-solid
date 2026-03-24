import type { FileModel } from "#src/file/model/FileModel.js"
import { uploadStatus, type UploadStatus } from "#src/file/model_field/uploadStatus.js"
import type { UploadAreaFileInfo } from "#src/file/ui/stats/UploadAreaFileInfo.js"
import { UploadFileStats } from "#src/file/ui/stats/UploadFileStats.jsx"
import { UploadAreaFileView } from "#src/file/ui/upload_file/UploadAreaFileView.jsx"
import { uploadHandlerFile } from "#src/file/ui/upload_file/uploadHandlerFile.jsx"
import type { MayHaveResourceId } from "#src/resource/model/MayHaveResourceId.js"
import { classMerge } from "#ui/utils/classMerge.js"
import type { SignalObject } from "#ui/utils/createSignalObject.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import type { MayHaveId } from "#ui/utils/MayHaveId.js"
import { generateId12 } from "#utils/ran/generateId12.js"
import { Show, type Accessor, type JSX } from "solid-js"

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
