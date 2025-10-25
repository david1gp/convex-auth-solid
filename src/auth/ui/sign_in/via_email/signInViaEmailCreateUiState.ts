import { apiAuthSignInViaEmail } from "@/auth/api/apiAuthSignInViaEmail"
import { emailSchema } from "@/auth/model/emailSchema"
import { urlSignInEnterOtp } from "@/auth/url/urlSignInEnterOtp"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { debounceMs } from "@/utils/ui/debounceMs"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type SignInViaEmailUiState = {
  email: SignalObject<string>
  isSubmitting: SignalObject<boolean>
}

export function signInViaEmailCreateUiState(): SignInViaEmailUiState {
  return {
    email: createSignalObject(""),
    isSubmitting: createSignalObject(false),
  }
}

export type SignInViaEmailErrorState = {
  email: SignalObject<string>
}

export function createSignInViaEmailErrorState(): SignInViaEmailErrorState {
  return {
    email: createSignalObject(""),
  }
}

export type SignInViaEmailFormData = {
  email: string
}

export type SignInViaEmailStateManagement = {
  state: SignInViaEmailUiState
  errors: SignInViaEmailErrorState
  hasErrors: () => boolean
  validateOnChange: (field: keyof SignInViaEmailFormData) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => void
}

type NavigateType = (to: string) => void
type LocationType = { pathname: string }

export function createSignInViaEmailStateManagement(
  navigate: NavigateType,
  location: LocationType,
): SignInViaEmailStateManagement {
  const state = signInViaEmailCreateUiState()
  const errors = createSignInViaEmailErrorState()

  return {
    state,
    errors,
    hasErrors: () => hasErrors(errors),
    validateOnChange: (field: keyof SignInViaEmailFormData) => validateOnChange(field, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, navigate, location, state, errors),
  }
}

function hasErrors(errors: SignInViaEmailErrorState): boolean {
  return !!errors.email.get()
}

function validateOnChange(field: keyof SignInViaEmailFormData, errors: SignInViaEmailErrorState) {
  return debounce((value: string) => {
    const result = validateField(field, value)
    const errorSig = errors[field]
    if (result.success) {
      errorSig.set("")
    } else {
      errorSig.set(result.issues[0].message)
    }
  }, debounceMs)
}

function handleSubmit(
  e: SubmitEvent,
  navigate: NavigateType,
  location: LocationType,
  state: SignInViaEmailUiState,
  errors: SignInViaEmailErrorState,
) {
  e.preventDefault()
  state.isSubmitting.set(true)

  const emailResult = validateField("email", state.email.get())

  if (!emailResult.success) {
    errors.email.set(emailResult.issues[0].message)
    state.isSubmitting.set(false)
    return
  } else {
    errors.email.set("")
  }

  if (emailResult.success) {
    console.log("Sign in via email submitted", {
      email: state.email.get(),
    })
    handleSignInViaEmail(state.email.get(), navigate, location, state, errors)
  }
}

async function handleSignInViaEmail(
  email: string,
  navigate: NavigateType,
  location: LocationType,
  state: SignInViaEmailUiState,
  errors: SignInViaEmailErrorState,
) {
  const result = await apiAuthSignInViaEmail({ email })
  if (!result.success) {
    toastAdd({ title: "Error signing in", description: result.errorMessage })
    state.isSubmitting.set(false)
    return
  }
  state.isSubmitting.set(false)

  const returnPath = urlSignInRedirectUrl(location.pathname)
  const url = urlSignInEnterOtp(email, "", returnPath)
  navigate(url)
}

function validateField(field: keyof SignInViaEmailFormData, value: string) {
  const schema = emailSchema
  return v.safeParse(schema, value)
}
