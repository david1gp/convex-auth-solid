import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"
import { resourceFilesSchema, type ResourceFilesModel } from "@/resource/model/ResourceFilesModel"
import * as a from "valibot"
import { createResult, createResultError, type Result } from "~utils/result/Result"
import { resultTryParsingFetchErr } from "~utils/result/resultTryParsingFetchErr"

export const apiBaseResource = "/api/resource"
export const apiPathResourceGet = "/get"

export interface ResourceGetProps {
  resourceId: string
  token?: string
}

export async function apiResourceGet(props: ResourceGetProps): Promise<Result<ResourceFilesModel>> {
  const op = "apiResourceGet"

  if (!props.resourceId) return createResultError(op, "!resourceId")

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  // Build URL with query parameters
  const url = new URL(baseUrl + apiBaseResource + apiPathResourceGet)
  url.searchParams.append("resourceId", props.resourceId)

  if (props.token) {
    url.searchParams.append("token", props.token)
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const text = await response.text()
  if (!response.ok) {
    console.error(op, response.status, response.statusText, text)
    return resultTryParsingFetchErr(op, text, response.status, response.statusText)
  }

  const schema = a.pipe(a.string(), a.parseJson(), resourceFilesSchema)

  const parseResult = a.safeParse(schema, text)
  if (!parseResult.success) {
    const errorMessage = a.summarize(parseResult.issues)
    console.error(op, errorMessage, parseResult.issues)
    return createResultError(op, errorMessage, text)
  }

  return createResult(parseResult.output)
}
