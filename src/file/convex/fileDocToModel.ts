import type { DocFile } from "#src/file/convex/IdFile.js"
import type { FileModel } from "#src/file/model/FileModel.js"

export function fileDocToModel({ _id, _creationTime, ...rest }: DocFile): FileModel {
  return rest
}
