import * as a from "valibot"
import { fileSchema } from "#src/file/model/fileSchema.ts"
import { resourceSchema } from "#src/resource/model/resourceSchema.ts"
import { paginationResultSchema } from "#src/utils/convex_backend/paginationResultSchema.ts"

export const resourceFilesPageSchema = a.object({
  resource: resourceSchema,
  files: paginationResultSchema(fileSchema),
})

export type ResourceFilesPageModel = a.InferOutput<typeof resourceFilesPageSchema>
