import type { PaginationOptions } from "convex/server"
import * as a from "valibot"
import { createResult, createResultError, type Result, resultTryParsingFetchErr } from "#result"
import { envBaseUrlApiResult } from "#src/app/env/public/envBaseUrlApiResult.ts"
import type { ResourceFilesPageModel } from "#src/resource/model/ResourceFilesPageModel.ts"
import { resourceFilesPageSchema } from "#src/resource/model/ResourceFilesPageModel.ts"

export const apiBaseResource = "/api/resource"
export const apiPathResourceGet = "/get"

export interface ResourceGetProps {
  resourceId: string
  token?: string
  paginationOpts?: Pick<PaginationOptions, "cursor" | "numItems">
}

export async function apiResourceGet(props: ResourceGetProps): Promise<Result<ResourceFilesPageModel>> {
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

  if (props.paginationOpts?.cursor) {
    url.searchParams.append("cursor", props.paginationOpts.cursor)
  }

  if (props.paginationOpts?.numItems !== undefined) {
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

  const schema = a.pipe(a.string(), a.parseJson(), resourceFilesPageSchema)

  const parseResult = a.safeParse(schema, text)
  if (!parseResult.success) {
    const errorMessage = a.summarize(parseResult.issues)
    console.error(op, errorMessage, parseResult.issues)
    return createResultError(op, errorMessage, text)
  }

  return createResult(parseResult.output)
}
