import type { FileModel } from "@/file/model/FileModel"
import { fileSchema } from "@/file/model/fileSchema"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { resourceSchema } from "@/resource/model/resourceSchema"
import * as a from "valibot"

export interface ResourceFilesModel {
  resource: ResourceModel
  files: FileModel[]
}

export const resourceFilesSchema = a.object({
  resource: resourceSchema,
  files: a.array(fileSchema),
})
