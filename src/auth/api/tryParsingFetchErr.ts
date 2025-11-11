import * as a from "valibot"
import { createError } from "~utils/result/Result"
import { resultErrSchemaFromJsonString } from "~utils/result/resultErrSchema"

export function tryParsingFetchErr(op: string, text: string, statusCode: number, responseStatusText: string) {
  const op2 = "tryParsingErr"
  const parsingErr = a.safeParse(resultErrSchemaFromJsonString, text)
  if (!parsingErr.success) {
    const e = createError(op + "." + op2, responseStatusText, text)
    e.statusCode = statusCode
    return e
  }
  const e = parsingErr.output
  e.statusCode = statusCode
  return e
}
