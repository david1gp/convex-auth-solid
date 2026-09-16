import type { PaginationOptions } from "convex/server"
import * as a from "valibot"
import { createResult, createResultError, type Result, resultTryParsingFetchErr } from "#result"
import { envBaseUrlApiResult } from "#src/app/env/public/envBaseUrlApiResult.ts"
import type { Language } from "#src/app/i18n/language.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { resourceSchema } from "#src/resource/model/resourceSchema.ts"
import type { ResourceType } from "#src/resource/model_field/resourceType.ts"
import type { Visibility } from "#src/resource/model_field/visibility.ts"
import { paginationResultSchema } from "#src/utils/convex_backend/paginationResultSchema.ts"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"

export const apiBaseResource = "/api/resource"
export const apiPathResourceList = "/list"

export interface ResourceListProps {
  orgHandle?: string
  meetingId?: string
  l?: Language
  type?: ResourceType
  visibility?: Visibility
  searchText?: string
  paginationOpts?: Pick<PaginationOptions, "cursor" | "numItems">
}

export async function apiResourceList(props?: ResourceListProps): Promise<Result<PaginationResultType<ResourceModel>>> {
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

  if (props?.l) {
    url.searchParams.append("l", props.l)
  }

  if (props?.type) {
    url.searchParams.append("type", props.type)
  }

  if (props?.visibility) {
    url.searchParams.append("visibility", props.visibility)
  }

  if (props?.searchText) {
    url.searchParams.append("searchText", props.searchText)
  }

  if (props?.paginationOpts?.cursor) {
    url.searchParams.append("cursor", props.paginationOpts.cursor)
  }

  if (props?.paginationOpts?.numItems !== undefined) {
    url.searchParams.append("numItems", String(props.paginationOpts.numItems))
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

  const schema = a.pipe(a.string(), a.parseJson(), paginationResultSchema(resourceSchema))
  const parseResult = a.safeParse(schema, text)
  if (!parseResult.success) {
    const errorMessage = a.summarize(parseResult.issues)
    console.error(op, errorMessage, parseResult.issues)
    return createResultError(op, errorMessage, text)
  }

  return createResult(parseResult.output)
}
