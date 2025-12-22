import { apiAuthSignInViaEmail } from "@/auth/api/apiAuthSignInViaEmail"
import { urlSignInEnterOtp } from "@/auth/url/urlSignInEnterOtp"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { navigateTo } from "@/utils/router/navigateTo"
import { debounceMs } from "@/utils/ui/debounceMs"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import posthog from "posthog-js"
import * as a from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type SignInViaEmailUiState = {
  email: SignalObject<string>
}

function signInViaEmailCreateUiState(): SignInViaEmailUiState {
  return {
    email: createSignalObject(""),
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
  isSubmitting: SignalObject<boolean>
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
  const isSubmitting = createSignalObject(false)
  const errors = createSignInViaEmailErrorState()

  return {
    state,
    isSubmitting,
    fillTestData: () => fillTestData(state, errors),
    errors,
    hasErrors: () => hasErrors(errors),
    validateOnChange: (field: SignInViaEmailFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, state, isSubmitting, errors),
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

function handleSubmit(
  e: SubmitEvent,
  state: SignInViaEmailUiState,
  isSubmitting: SignalObject<boolean>,
  errors: SignInViaEmailErrorState,
) {
  e.preventDefault()

  if (isSubmitting.get()) {
    const title = ttt("Submission in progress, please wait")
    console.info(title)
    return
  }

  const emailResult = validateFieldResult("email", state.email.get())

  if (!emailResult.success) {
    errors.email.set(emailResult.issues[0].message)
  } else {
    errors.email.set("")
  }

  handleSignInViaEmail(state.email.get(), state, isSubmitting, errors)
}

async function handleSignInViaEmail(
  email: string,
  state: SignInViaEmailUiState,
  isSubmitting: SignalObject<boolean>,
  errors: SignInViaEmailErrorState,
) {
  const op = "handleSignInViaEmail"
  console.log("Sign in via email submitted", {
    email: state.email.get(),
  })
  isSubmitting.set(true)
  const result = await apiAuthSignInViaEmail({ email })
  isSubmitting.set(false)

  posthog.capture(op, result)

  if (!result.success) {
    toastAdd({ title: ttt("Error signing in"), description: result.errorMessage })
    return
  }
  toastAdd({ title: ttt("Successfully signed in"), variant: toastVariant.success })

  const returnPath = urlSignInRedirectUrl(document.location.pathname)
  const url = urlSignInEnterOtp(email, "", returnPath)
  navigateTo(url)
}

function validateFieldResult(field: keyof SignInViaEmailFormData, value: string) {
  const schema = emailSchema
  return a.safeParse(schema, value)
}
