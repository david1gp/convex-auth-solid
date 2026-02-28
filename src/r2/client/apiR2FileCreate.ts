import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { FileDataModel } from "@/file/model/FileModel"
import { apiBaseR2 } from "@/r2/client/apiBaseR2"
import { apiPathR2FileCreate } from "@/r2/convex/r2FileCreateHttpHandler"
import type { PromiseResult } from "~utils/result/Result"
import { createResult, createResultError } from "~utils/result/Result"
import { resultTryParsingFetchErr } from "~utils/result/resultTryParsingFetchErr"

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
