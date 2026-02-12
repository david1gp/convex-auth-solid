import { createResultError, type ResultErr } from "~utils/result/Result"

export function createErrorAndLogError(
  op: string,
  errorMessage: string,
  errorData?: string | null,
  statusCode?: number,
): ResultErr {
  const err = createResultError(op, errorMessage, errorData)
  console.error(op, err)
  if (statusCode) err.statusCode = statusCode
  return err
}
