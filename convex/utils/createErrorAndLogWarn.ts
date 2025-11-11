import { type ResultErr, createResultError } from "~utils/result/Result"

export function createErrorAndLogWarn(op: string, errorMessage: string, errorData?: string | null): ResultErr {
  console.warn(op, errorMessage, errorData)
  return createResultError(op, errorMessage, errorData)
}
