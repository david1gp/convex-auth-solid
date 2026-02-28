import type { DocFile } from "@/file/convex/IdFile"
import type { FileModel } from "@/file/model/FileModel"

export function fileDocToModel({ _id, _creationTime, ...rest }: DocFile): FileModel {
  return rest
}
