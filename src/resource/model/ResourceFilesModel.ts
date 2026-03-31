import type { FileModel } from "#src/file/model/FileModel.ts"
import { fileSchema } from "#src/file/model/fileSchema.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { resourceSchema } from "#src/resource/model/resourceSchema.ts"
import * as a from "valibot"

export interface ResourceFilesModel {
  resource: ResourceModel
  files: FileModel[]
}

export const resourceFilesSchema = a.object({
  resource: resourceSchema,
  files: a.array(fileSchema),
})
