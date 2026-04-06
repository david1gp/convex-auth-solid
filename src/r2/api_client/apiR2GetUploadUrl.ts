import { createResult, resultTryParsingFetchErr, type Result } from "#result"
import { envBaseUrlApiResult } from "#src/app/env/public/envBaseUrlApiResult.ts"
import { apiBaseR2 } from "./apiBaseR2.js"

export const apiPathR2UploadUrl = "/uploadUrl"

export async function apiR2GetUploadUrl(token: string, fileId: string): Promise<Result<string>> {
  const op = "apiR2GetUploadUrl"

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  const url = new URL(baseUrl + apiBaseR2 + apiPathR2UploadUrl)
  url.searchParams.set("fileId", fileId)

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })

  const text = await response.text()
  if (!response.ok) {
    console.error(op, response.status, response.statusText, text)
    return resultTryParsingFetchErr(op, text, response.status, response.statusText)
  }

  console.log(op, text)

  // const schema = a.pipe(a.string(), a.parseJson(), a.string())
  // const parseResult = a.safeParse(schema, text)
  // if (!parseResult.success) {
  //   const errorMessage = a.summarize(parseResult.issues)
  //   console.error(op, errorMessage, parseResult.issues, text)
  //   return createResultError(op, errorMessage, text)
  // }

  // return createResult(parseResult.output)

  return createResult(text)
}
