import { ttc } from "@/app/i18n/ttc"
import type { FileModel } from "@/file/model/FileModel"
import { fileInformationGet } from "@/file/ui/stats/fileInformationGet"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { uploadHandlerFilePure } from "@/file/ui/upload_file/uploadHandlerFile"
import type { MayHaveResourceId } from "@/resource/model/MayHaveResourceId"
import posthog from "posthog-js"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { SignalObject } from "~ui/utils/createSignalObject"
import { createResultError, type PromiseResult } from "~utils/result/Result"

export interface ImageUploadHandlerProps extends MayHaveResourceId {
  file: File
  uploadInfo: SignalObject<UploadAreaFileInfo | null>
  uploadError?: SignalObject<string | null>
  onUploadSuccess?: (file: FileModel) => void
}

export async function uploadHandlerImage(p: ImageUploadHandlerProps): PromiseResult<FileModel> {
  const op = "uploadHandlerImage"

  await fileInformationGet(p.file, p.uploadInfo)

  const info = p.uploadInfo.get()

  const uploadResult = await uploadHandlerImagePure(p.file, info, p.resourceId)
  posthog.capture(op, uploadResult)
  if (!uploadResult.success) {
    const errorMessage = ttc("Failed to upload image")
    console.error(uploadResult)
    p.uploadError?.set(uploadResult.errorMessage)
    toastAdd({
      title: errorMessage,
      description: uploadResult.errorMessage,
      variant: toastVariant.error,
    })
    return uploadResult
  }
  const uploadedFile = uploadResult.data

  const successMessage = ttc("Image uploaded successfully")
  console.log(op, successMessage, uploadedFile)
  toastAdd({
    title: successMessage,
    variant: toastVariant.success,
  })

  p.uploadInfo.set(null)
  p.onUploadSuccess?.(uploadedFile)
  return uploadResult
}

export async function uploadHandlerImagePure(
  file: File,
  info: UploadAreaFileInfo | null,
  _resourceId?: string,
): PromiseResult<FileModel> {
  const op = "uploadHandlerImagePure"

  if (!info) {
    const errorMessage = ttc("Missing file information")
    return createResultError(op, errorMessage)
  }

  if (!info.imageWidth || !info.imageHeight) {
    const errorMessage = ttc("Invalid image file or missing dimensions")
    return createResultError(op, errorMessage)
  }

  return uploadHandlerFilePure(file, info, _resourceId)
}
