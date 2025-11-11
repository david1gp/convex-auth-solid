import { userSessionSchema, type UserSession } from "@/auth/model/UserSession"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { createUrl } from "@/utils/router/createUrl"
import { navigateTo } from "@/utils/router/navigateTo"
import { searchParamGet } from "@/utils/router/searchParamGet"
import * as a from "valibot"
import { createResult, createResultError, type Result } from "~utils/result/Result"
import { base64urlDecodeObject } from "~utils/url/base64url"

export function signInLogic(): void {
  const op = "signInLogic"

  const url = createUrl()

  const userSessionString = searchParamGet("userSession", url)
  if (!userSessionString) {
    // do nothing, user should choose sign up/in method
    return
  }

  try {
    const signedIn = signedInLogicResult(url)
    if (!signedIn.success) {
      const errorMessage = signedIn.errorMessage || "Unknown error"
      navigateToErrorPage(op, errorMessage)
    } else {
      // success, userSession is set -> LayoutWrapper should router switch to a different route
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    navigateToErrorPage(op, errorMessage)
  }
}

export function navigateToErrorPage(op: string, errorMessage: string, error?: unknown): void {
  console.error(op, "errorMessage:", errorMessage, "error:", error)
  navigateTo(`${pageRouteAuth.signInError}?errorMessage=${encodeURIComponent(errorMessage)}`)
}

function signedInLogicResult(url: URL): Result<UserSession> {
  const op = "signedInLogic"
  // check args
  const userSessionString = searchParamGet("userSession", url)
  if (!userSessionString) return createResultError(op, "!userSession")
  // decode session
  const decodedUserSessionObjectResult = base64urlDecodeObject(userSessionString)
  if (!decodedUserSessionObjectResult.success) return decodedUserSessionObjectResult
  // parse session
  const parsingResult = a.safeParse(userSessionSchema, decodedUserSessionObjectResult.data)
  if (!parsingResult.success)
    return createResultError(
      op,
      a.summarize(parsingResult.issues),
      JSON.stringify(decodedUserSessionObjectResult.data, null, 2),
    )
  const newSession: UserSession = parsingResult.output
  // save auth
  userSessionsSignalAdd(newSession)
  userSessionSignal.set(newSession)
  return createResult(newSession)
}
