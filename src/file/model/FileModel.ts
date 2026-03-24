import type { IdUser } from "#src/auth/convex/IdUser.js"
import type { fileDataSchema } from "#src/file/model/fileSchema.js"
import type { HasCreatedAtUpdatedAt } from "#src/utils/data/HasCreatedAtUpdatedAt.js"
import * as a from "valibot"

export type FileDataModel = a.InferOutput<typeof fileDataSchema>

export interface FileModel extends FileDataModel, HasCreatedAtUpdatedAt {
  deletedAt?: string
}

export interface FileDataModelWithUserMetadata extends FileDataModel {
  userId: IdUser
  username?: string
}
