import { apiAuthSignInViaEmail } from "@/auth/api/apiAuthSignInViaEmail"
import { urlSignInEnterOtp } from "@/auth/url/urlSignInEnterOtp"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { navigateTo } from "@/utils/router/navigateTo"
import { debounceMs } from "@/utils/ui/debounceMs"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as a from "valibot"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type SignInViaEmailUiState = {
  email: SignalObject<string>
  isSubmitting: SignalObject<boolean>
}

function signInViaEmailCreateUiState(): SignInViaEmailUiState {
  return {
    email: createSignalObject(""),
    isSubmitting: createSignalObject(false),
  }
}

function fillTestData(state: SignInViaEmailUiState, errors: SignInViaEmailErrorState) {
  state.email.set("test@example.com")
  updateFieldError(signInViaEmailFormField.email, state.email.get(), state, errors)
}

export type SignInViaEmailErrorState = {
  email: SignalObject<string>
}

export function createSignInViaEmailErrorState(): SignInViaEmailErrorState {
  return {
    email: createSignalObject(""),
  }
}

function updateFieldError(
  field: SignInViaEmailFormField,
  value: string,
  state: SignInViaEmailUiState,
  errors: SignInViaEmailErrorState,
) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

export const signInViaEmailFormField = {
  email: "email",
} as const

export type SignInViaEmailFormField = keyof typeof signInViaEmailFormField

export type SignInViaEmailFormData = {
  email: string
}

export type SignInViaEmailStateManagement = {
  state: SignInViaEmailUiState
  fillTestData: () => void
  errors: SignInViaEmailErrorState
  hasErrors: () => boolean
  validateOnChange: (field: SignInViaEmailFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => void
}

type NavigateType = (to: string) => void
type LocationType = { pathname: string }

export function createSignInViaEmailStateManagement(): SignInViaEmailStateManagement {
  const state = signInViaEmailCreateUiState()
  const errors = createSignInViaEmailErrorState()

  return {
    state,
    fillTestData: () => fillTestData(state, errors),
    errors,
    hasErrors: () => hasErrors(errors),
    validateOnChange: (field: SignInViaEmailFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, state, errors),
  }
}

function hasErrors(errors: SignInViaEmailErrorState): boolean {
  return !!errors.email.get()
}

function validateOnChange(
  field: SignInViaEmailFormField,
  state: SignInViaEmailUiState,
  errors: SignInViaEmailErrorState,
) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

function handleSubmit(e: SubmitEvent, state: SignInViaEmailUiState, errors: SignInViaEmailErrorState) {
  e.preventDefault()
  const emailResult = validateFieldResult("email", state.email.get())

  if (!emailResult.success) {
    errors.email.set(emailResult.issues[0].message)
  } else {
    errors.email.set("")
  }

  handleSignInViaEmail(state.email.get(), state, errors)
}

async function handleSignInViaEmail(email: string, state: SignInViaEmailUiState, errors: SignInViaEmailErrorState) {
  console.log("Sign in via email submitted", {
    email: state.email.get(),
  })
  state.isSubmitting.set(true)
  const result = await apiAuthSignInViaEmail({ email })
  state.isSubmitting.set(false)

  if (!result.success) {
    toastAdd({ title: "Error signing in", description: result.errorMessage })
    return
  }

  const returnPath = urlSignInRedirectUrl(document.location.pathname)
  const url = urlSignInEnterOtp(email, "", returnPath)
  navigateTo(url)
}

function validateFieldResult(field: keyof SignInViaEmailFormData, value: string) {
  const schema = emailSchema
  return a.safeParse(schema, value)
}
