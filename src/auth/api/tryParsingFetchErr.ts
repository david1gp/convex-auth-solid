import * as v from "valibot"
import { createError } from "~utils/result/Result"
import { resultErrSchemaFromJsonString } from "~utils/result/resultErrSchema"

export function tryParsingFetchErr(op: string, text: string, responseStatusText: string) {
  const op2 = "tryParsingErr"
  const parsingErr = v.safeParse(resultErrSchemaFromJsonString, text)
  if (!parsingErr.success) {
    return createError(op + "." + op2, responseStatusText, text)
  }
  return parsingErr.output
}
