import type { FileDataUnuploaded } from "#src/file/model/FileDataUnuploaded.js"

export interface UploadAreaFileInfo extends FileDataUnuploaded {
  preview?: string
}
