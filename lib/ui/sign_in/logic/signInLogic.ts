import type { Navigator } from "@solidjs/router"
import type { SearchParams } from "node_modules/@solidjs/router/dist/types"
import * as v from "valibot"
import { userSessionSchema, type UserSession } from "~auth/model/UserSession"
import { userSessionSignal } from "~auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "~auth/ui/signals/userSessionsSignal"
import { pageRouteAuth } from "~auth/url/pageRouteAuth"
import { createResult, createResultError, type Result } from "~utils/result/Result"
import { base64urlDecodeObject } from "~utils/url/base64url"

export function signInLogic(searchParams: Partial<SearchParams>, navigate: Navigator): void {
  const op = "signInLogic"

  const userSessionString = searchParams.userSession as string | undefined
  if (!userSessionString) {
    // do nothing, user should choose sign up/in method
    return
  }

  try {
    const signedIn = signedInLogicResult(searchParams, navigate)
    if (!signedIn.success) {
      const errorMessage = signedIn.errorMessage || "Unknown error"
      navigateToErrorPage(op, navigate, errorMessage)
    } else {
      // success, userSession is set -> LayoutWrapper should router switch to a different route
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    navigateToErrorPage(op, navigate, errorMessage)
  }
}

export function navigateToErrorPage(op: string, navigate: Navigator, errorMessage: string, error?: unknown): void {
  console.error(op, "errorMessage:", errorMessage, "error:", error)
  navigate(`${pageRouteAuth.signInError}?errorMessage=${encodeURIComponent(errorMessage)}`, { replace: true })
}

function signedInLogicResult(searchParams: Partial<SearchParams>, navigate: Navigator): Result<UserSession> {
  const op = "signedInLogic"
  // check args
  const userSessionString = searchParams.userSession as string | undefined
  if (!userSessionString) return createResultError(op, "!userSession")
  // decode session
  const decodedUserSessionObjectResult = base64urlDecodeObject(userSessionString)
  if (!decodedUserSessionObjectResult.success) return decodedUserSessionObjectResult
  // parse session
  const parsingResult = v.safeParse(userSessionSchema, decodedUserSessionObjectResult.data)
  if (!parsingResult.success)
    return createResultError(
      op,
      v.summarize(parsingResult.issues),
      JSON.stringify(decodedUserSessionObjectResult.data, null, 2),
    )
  const newSession: UserSession = parsingResult.output
  // save auth
  userSessionsSignalAdd(newSession)
  userSessionSignal.set(newSession)
  return createResult(newSession)
}

function addUserSesssionOrReplace(userSessions: UserSession[], userProfile: UserSession) {
  const existingUserIndex = userSessions.findIndex((session) => session.user.userId === userProfile.user.userId)
  const newSessions = [...userSessions]

  if (existingUserIndex !== -1) {
    // Update existing user session
    newSessions[existingUserIndex] = userProfile
  } else {
    // Add new user session
    newSessions.push(userProfile)
  }
  return newSessions
}
