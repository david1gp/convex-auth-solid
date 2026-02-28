import { imageDimensionsFromHtmlElement } from "@/file/ui/stats/imageDimensionsFromHtml"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import type { SignalObject } from "~ui/utils/createSignalObject"

export async function fileInformationGet(selectedFile: File, info: SignalObject<UploadAreaFileInfo | null>) {
  const fileInfo: UploadAreaFileInfo = {
    displayName: selectedFile.name,
    fileSize: selectedFile.size,
    contentType: selectedFile.type || "unknown",
  }
  if (fileInfo.contentType.startsWith("image/")) {
    const img = createImageForPreview(selectedFile)
    fileInfo.preview = img.src
    const imageDimensions = await imageDimensionsFromHtmlElement(img)
    fileInfo.imageWidth = imageDimensions.imageWidth
    fileInfo.imageHeight = imageDimensions.imageHeight
  }
  info.set(fileInfo)
}

function createImageForPreview(selectedFile: File): HTMLImageElement {
  const img = new Image()
  img.crossOrigin = "anonymous"
  const preview = URL.createObjectURL(selectedFile)
  img.src = preview
  return img
}
