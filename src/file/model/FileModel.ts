import type { IdUser } from "@/auth/convex/IdUser"
import type { fileDataSchema } from "@/file/model/fileSchema"
import type { HasCreatedAtUpdatedAt } from "@/utils/data/HasCreatedAtUpdatedAt"
import * as a from "valibot"

export type FileDataModel = a.InferOutput<typeof fileDataSchema>

export interface FileModel extends FileDataModel, HasCreatedAtUpdatedAt {
  deletedAt?: string
}

export interface FileDataModelWithUserMetadata extends FileDataModel {
  userId: IdUser
  username?: string
}
