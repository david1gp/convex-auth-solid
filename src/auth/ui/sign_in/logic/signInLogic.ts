import { createResult, createResultError, type Result } from "#result"
import { userSessionSchema, type UserSession } from "#src/auth/model/UserSession.js"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.js"
import { pageRouteAuth } from "#src/auth/url/pageRouteAuth.js"
import { createUrl } from "#src/utils/router/createUrl.js"
import { navigateTo } from "#src/utils/router/navigateTo.js"
import { searchParamGet } from "#src/utils/router/searchParamGet.js"
import { base64urlDecodeObject } from "#utils/url/base64url.js"
import * as a from "valibot"

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
  signInSessionNew(newSession)
  return createResult(newSession)
}
