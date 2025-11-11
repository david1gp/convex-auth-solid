import { createResultError, type ResultErr } from "~utils/result/Result"

export function createErrorAndLogError(op: string, errorMessage: string, errorData?: string | null): ResultErr {
  console.error(op, errorMessage, errorData)
  return createResultError(op, errorMessage, errorData)
}
