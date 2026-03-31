import type { FileDataUnuploaded } from "#src/file/model/FileDataUnuploaded.ts"

export interface UploadAreaFileInfo extends FileDataUnuploaded {
  preview?: string
}
