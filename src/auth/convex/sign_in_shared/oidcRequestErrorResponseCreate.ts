import { createResultError } from "#result"
import { jsonStringifyPretty } from "#utils/json/jsonStringifyPretty.js"

export function oidcRequestErrorResponseCreate(
  operationName: string,
  errorMessage: string,
  status: number,
  headers?: Headers,
): Response {
  const error = createResultError(operationName, errorMessage)
  console.warn(error)
  return new Response(jsonStringifyPretty(error), { status, headers })
}
