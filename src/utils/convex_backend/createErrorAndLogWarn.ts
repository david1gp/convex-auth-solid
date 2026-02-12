import { type ResultErr, createResultError } from "~utils/result/Result"

export function createErrorAndLogWarn(
  op: string,
  errorMessage: string,
  errorData?: string | null,
  statusCode?: number,
): ResultErr {
  const err = createResultError(op, errorMessage, errorData)
  console.warn(op, err)
  if (statusCode) err.statusCode = statusCode
  return createResultError(op, errorMessage, errorData)
}
