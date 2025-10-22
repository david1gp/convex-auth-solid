import { type UserSession, userSessionSchemaFromString } from "@/auth/model/UserSession"
import * as v from "valibot"
import { type Result, createError, createResult } from "~utils/result/Result"

export function parseUserSessionResponse(op: string, text: string): Result<UserSession> {
  const parsing = v.safeParse(userSessionSchemaFromString, text)
  if (!parsing.success) {
    return createError(op, v.summarize(parsing.issues), text)
  }
  return createResult(parsing.output)
}
