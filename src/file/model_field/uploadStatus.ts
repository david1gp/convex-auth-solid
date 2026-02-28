import { ttc } from "@/app/i18n/ttc"

export type UploadStatus = keyof typeof uploadStatus

export const uploadStatus = {
  empty: "empty",
  error: "error",
  uploading: "uploading",
  uploaded: "uploaded",
} as const

export const uploadStatusText = {
  empty: ttc("Empty"),
  error: ttc("Empty"),
  uploading: ttc("Uploading"),
  uploaded: ttc("Uploaded"),
} as const satisfies Record<UploadStatus, string>

export const uploadImageTexts = {
  onlyImages: () => ttc("Only image files are allowed"),
  success: () => ttc("Successfully uploaded"),
  clickToUpload: () => ttc("Click to upload image"),
  chosseAnotherFile: () => ttc("Please choose and upload another file"),
  uploadAnotherFile: () => ttc("Upload another file?"),
  max20: () => ttc("max 20 MB"),
  uploadingText: () => ttc("Uploading..."),
} as const

export const uploadFileTexts = {
  onlyFiles: () => ttc("Only files are allowed"),
  success: () => ttc("Successfully uploaded"),
  clickToUpload: () => ttc("Click to upload file"),
  chooseAnotherFile: () => ttc("Please choose and upload another file"),
  uploadAnotherFileQuestion: () => ttc("Upload another file?"),
  max20: () => ttc("max 20 MB"),
  uploadingText: () => ttc("Uploading..."),
  preview: () => ttc("Preview"),
} as const
