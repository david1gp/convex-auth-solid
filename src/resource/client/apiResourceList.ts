import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { resourceSchema } from "@/resource/model/resourceSchema"
import * as a from "valibot"
import { createResult, createResultError, type Result } from "~utils/result/Result"
import { resultTryParsingFetchErr } from "~utils/result/resultTryParsingFetchErr"

export const apiBaseResource = "/api/resource"
export const apiPathResourceList = "/list"

export interface ResourceListProps {
  orgHandle?: string
  meetingId?: string
}

export async function apiResourceList(props?: ResourceListProps): Promise<Result<ResourceModel[]>> {
  const op = "apiResourceList"

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  // Build URL with query parameters
  const url = new URL(baseUrl + apiBaseResource + apiPathResourceList)

  if (props?.orgHandle) {
    url.searchParams.append("orgHandle", props.orgHandle)
  }

  if (props?.meetingId) {
    url.searchParams.append("meetingId", props.meetingId)
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

  const schema = a.pipe(a.string(), a.parseJson(), a.array(resourceSchema))
  const parseResult = a.safeParse(schema, text)
  if (!parseResult.success) {
    const errorMessage = a.summarize(parseResult.issues)
    console.error(op, errorMessage, parseResult.issues)
    return createResultError(op, errorMessage, text)
  }

  return createResult(parseResult.output)
}
