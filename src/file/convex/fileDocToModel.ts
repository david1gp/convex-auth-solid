import type { DocFile } from "#src/file/convex/IdFile.ts"
import type { FileModel } from "#src/file/model/FileModel.ts"

export function fileDocToModel({ _id, _creationTime, ...rest }: DocFile): FileModel {
  return rest
}
