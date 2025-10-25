import { apiAuthSignInViaEmailEnterOtp } from "@/auth/api/apiAuthSignInViaEmailEnterOtp"
import { emailSchema } from "@/auth/model/emailSchema"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { getDefaultUrlSignedIn } from "@/auth/url/getDefaultUrlSignedIn"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import * as v from "valibot"

export type SignInViaEmailEnterOtpUiState = {
  isSubmitting: SignalObject<boolean>
}

export function createSignInViaEmailEnterOtpUiState(): SignInViaEmailEnterOtpUiState {
  return {
    isSubmitting: createSignalObject(false),
  }
}

export type SignInViaEmailEnterOtpFormData = {
  otp: string
  email: string
}

export type SignInViaEmailEnterOtpStateManagement = {
  state: SignInViaEmailEnterOtpUiState
  getEmail: (searchParams: Record<string, string | string[] | undefined>) => string
  getReturnPath: (searchParams: Record<string, string | string[] | undefined>) => string
  handleConfirm: (otp: string, email: string, returnPath: string) => Promise<void>
}

type NavigateType = (to: string) => void

export function signInViaEmailEnterOtpCreateStateManagement(navigate: NavigateType): SignInViaEmailEnterOtpStateManagement {
  const state = createSignInViaEmailEnterOtpUiState()

  return {
    state,
    getEmail: (searchParams: Record<string, string | string[] | undefined>) => getEmail(searchParams as Record<string, string>),
    getReturnPath: (searchParams: Record<string, string | string[] | undefined>) => getReturnPath(searchParams as Record<string, string>),
    handleConfirm: (otp: string, email: string, returnPath: string) => handleConfirm(otp, email, returnPath, navigate, state),
  }
}

function getEmail(searchParams: Record<string, string>): string {
  const got = searchParams.email
  const parsing = v.safeParse(emailSchema, got)
  if (!parsing.success) {
    console.error("error parsing email search param", got)
    return ""
  }
  return parsing.output
}

function getReturnPath(searchParams: Record<string, string>): string {
  const got = searchParams.returnPath
  const schema = v.pipe(v.string(), v.minLength(1))
  const parsing = v.safeParse(schema, got)
  if (!parsing.success) {
    console.warn("error parsing returnUrl", got)
    return getDefaultUrlSignedIn()
  }
  return parsing.output
}

async function handleConfirm(
  otp: string,
  email: string,
  returnPath: string,
  navigate: NavigateType,
  state: SignInViaEmailEnterOtpUiState,
) {
  state.isSubmitting.set(true)

  const result = await apiAuthSignInViaEmailEnterOtp({ email, code: otp })
  if (!result.success) {
    toastAdd({ title: "Error entering otp", description: result.errorMessage })
    state.isSubmitting.set(false)
    return
  }
  state.isSubmitting.set(false)

  const userSession = result.data
  // save user session
  userSessionsSignalAdd(userSession)
  userSessionSignal.set(userSession)
  // navigate
  navigate(returnPath)
}