import type { FileModel } from "#src/file/model/FileModel.js"
import { fileSchema } from "#src/file/model/fileSchema.js"
import type { ResourceModel } from "#src/resource/model/ResourceModel.js"
import { resourceSchema } from "#src/resource/model/resourceSchema.js"
import * as a from "valibot"

export interface ResourceFilesModel {
  resource: ResourceModel
  files: FileModel[]
}

export const resourceFilesSchema = a.object({
  resource: resourceSchema,
  files: a.array(fileSchema),
})
