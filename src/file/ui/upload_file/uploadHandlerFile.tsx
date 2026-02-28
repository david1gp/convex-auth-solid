import { envBaseUrlR2Result } from "@/app/env/public/envBaseUrlR2Result"
import { ttc } from "@/app/i18n/ttc"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"
import type { FileDataModel, FileModel } from "@/file/model/FileModel"
import { fileIdGenerate } from "@/file/model_field/fileIdGenerate"
import { fileInformationGet } from "@/file/ui/stats/fileInformationGet"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { apiR2FileCreate } from "@/r2/client/apiR2FileCreate"
import { apiR2GetUploadUrl } from "@/r2/client/apiR2GetUploadUrl"
import { apiR2UploadFileWithProgress } from "@/r2/client/apiR2UploadFile"
import type { MayHaveResourceId } from "@/resource/model/MayHaveResourceId"
import posthog from "posthog-js"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { SignalObject } from "~ui/utils/createSignalObject"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export interface FileUploadHandlerProps extends MayHaveResourceId {
  file: File
  uploadInfo: SignalObject<UploadAreaFileInfo | null>
  uploadError?: SignalObject<string | null>
  onUploadSuccess?: (file: FileModel) => void
}

export async function uploadHandlerFile(p: FileUploadHandlerProps): PromiseResult<FileModel> {
  const op = "uploadHandlerFile"

  await fileInformationGet(p.file, p.uploadInfo)

  const info = p.uploadInfo.get()

  const uploadResult = await uploadHandlerFilePure(p.file, info, p.resourceId)
  posthog.capture(op, uploadResult)
  if (!uploadResult.success) {
    const errorMessage = ttc("Failed to upload file")
    console.error(errorMessage, uploadResult)
    p.uploadError?.set(uploadResult.errorMessage)
    toastAdd({
      title: errorMessage,
      description: uploadResult.errorMessage,
      variant: toastVariant.error,
    })
    return uploadResult
  }
  const uploadedFile = uploadResult.data

  const successMessage = ttc("File uploaded successfully")
  console.log(op, successMessage, uploadedFile)
  toastAdd({
    title: successMessage,
    variant: toastVariant.success,
  })

  p.uploadInfo.set(null)
  p.onUploadSuccess?.(uploadedFile)
  return uploadResult
}

export async function uploadHandlerFilePure(
  file: File,
  info: UploadAreaFileInfo | null,
  _resourceId?: string,
): PromiseResult<FileModel> {
  const op = "uploadHandlerFilePure"

  const maxSize = 500 * 1024 * 1024
  if (file.size >= maxSize) {
    const errorMessage = ttc("File size exceeds 500 MB limit")
    return createResultError(op, errorMessage)
  }

  if (!info) {
    const errorMessage = ttc("Failed to get file information")
    return createResultError(op, errorMessage)
  }

  const session = userSessionGet()
  if (!session) {
    const errorMessage = ttc("No user session found")
    return createResultError(op, errorMessage)
  }
  const token = session.token

  const baseUrlR2Result = envBaseUrlR2Result()
  if (!baseUrlR2Result.success) {
    console.error(baseUrlR2Result)
    return createResultError(op, baseUrlR2Result.errorMessage)
  }
  const baseUrlR2 = baseUrlR2Result.data

  const fileId = fileIdGenerate(info.displayName)

  const urlResult = await apiR2GetUploadUrl(token, fileId)
  if (!urlResult.success) {
    console.error(urlResult)
    return createResultError(op, urlResult.errorMessage)
  }
  const url = urlResult.data

  const uploadResult = await apiR2UploadFileWithProgress(url, file, () => {})
  if (!uploadResult.success) {
    return createResultError(op, uploadResult.errorMessage)
  }

  const data: FileDataModel = {
    fileId,
    displayName: info.displayName,
    contentType: info.contentType,
    fileSize: info.fileSize,
    url: baseUrlR2 + "/" + fileId,
  }
  if (info.imageWidth) data.imageWidth = info.imageWidth
  if (info.imageHeight) data.imageHeight = info.imageHeight

  const fileCreateResult = await apiR2FileCreate(data)

  if (!fileCreateResult.success) {
    return createResultError(op, fileCreateResult.errorMessage)
  }

  const now = new Date().toISOString()
  const fileModel: FileModel = {
    ...data,
    createdAt: now,
    updatedAt: now,
  }

  return createResult(fileModel)
}
