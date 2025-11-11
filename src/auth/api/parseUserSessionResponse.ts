import { type UserSession, userSessionSchemaFromString } from "@/auth/model/UserSession"
import * as a from "valibot"
import { type Result, createError, createResult } from "~utils/result/Result"

export function parseUserSessionResponse(op: string, text: string): Result<UserSession> {
  const parsing = a.safeParse(userSessionSchemaFromString, text)
  if (!parsing.success) {
    return createError(op, a.summarize(parsing.issues), text)
  }
  return createResult(parsing.output)
}
