import { pageRouteFile } from "#src/file/url/pageRouteFile.ts"
import { stringReplaceParam1 } from "#src/utils/text/stringReplaceParam1.ts"
import { stringReplaceParam2 } from "#src/utils/text/stringReplaceParam2.ts"

export function urlFileEdit(resourceId: string, fileId: string) {
  //  + "?" + serializeUrlParams({ displayName })
  return stringReplaceParam2(pageRouteFile.resourceFileEdit, "resourceId", resourceId, "fileId", fileId)
}

export function urlFileRemove(resourceId: string, fileId: string) {
  return stringReplaceParam2(pageRouteFile.resourceFileRemove, "resourceId", resourceId, "fileId", fileId)
}

export function urlFileUpload(resourceId: string) {
  return stringReplaceParam1(pageRouteFile.resourceFileAdd, "resourceId", resourceId)
}
