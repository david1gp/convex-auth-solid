import { pageRouteFile } from "@/file/url/pageRouteFile"
import { stringReplaceParam1 } from "@/utils/text/stringReplaceParam1"
import { stringReplaceParam2 } from "@/utils/text/stringReplaceParam2"

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
