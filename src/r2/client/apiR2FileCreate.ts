import { createResult, createResultError, resultTryParsingFetchErr, type PromiseResult } from "#result"
import { envBaseUrlApiResult } from "#src/app/env/public/envBaseUrlApiResult.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { FileDataModel } from "#src/file/model/FileModel.js"
import { apiBaseR2 } from "#src/r2/client/apiBaseR2.js"
import { apiPathR2FileCreate } from "#src/r2/convex/r2FileCreateHttpHandler.js"

export async function apiR2FileCreate(data: FileDataModel): PromiseResult<string> {
  const op = "apiR2FileCreate"

  const token = userTokenGet()
  if (!token) return createResultError(op, "No token")

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  const url = new URL(baseUrl + apiBaseR2 + apiPathR2FileCreate)

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error(op, response.status, response.statusText, text)
    return resultTryParsingFetchErr(op, text, response.status, response.statusText)
  }

  return createResult(text)
}
