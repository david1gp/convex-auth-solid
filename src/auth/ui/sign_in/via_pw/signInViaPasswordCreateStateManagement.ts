import { apiAuthSignInViaPw } from "@/auth/api/apiAuthSignInViaPw"
import { passwordSchema } from "@/auth/model_field/passwordSchema"
import { signInSessionNew } from "@/auth/ui/sign_in/logic/signInSessionNew"
import { debounceMs } from "@/utils/ui/debounceMs"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import posthog from "posthog-js"
import * as a from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type SignInUiState = {
  email: SignalObject<string>
  password: SignalObject<string>
  //
  isSubmitting: SignalObject<boolean>
}

export function createSignInUiState(): SignInUiState {
  return {
    email: createSignalObject(""),
    password: createSignalObject(""),
    //
    isSubmitting: createSignalObject(false),
  }
}

function fillTestData(state: SignInUiState, errors: SignInErrorState) {
  state.email.set("test@example.com")
  state.password.set("121212121212")
  for (const field of Object.values(signInViaPwFormField)) {
    updateFieldError(field, state[field].get(), state, errors)
  }
}

export type SignInErrorState = {
  email: SignalObject<string>
  password: SignalObject<string>
}

export function createSignInErrorState(): SignInErrorState {
  return {
    email: createSignalObject(""),
    password: createSignalObject(""),
  }
}

function updateFieldError(field: SignInViaPwFormField, value: string, state: SignInUiState, errors: SignInErrorState) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field]
  if (result.success) {
    errorSig.set("")
  } else {
    errorSig.set(result.issues[0].message)
  }
}

export const signInViaPwFormField = {
  email: "email",
  password: "password",
} as const

export type SignInViaPwFormField = keyof typeof signInViaPwFormField

export type SignInFormData = {
  email: string
  password: string
}

export type SignInViaPasswordStateManagement = {
  state: SignInUiState
  fillTestData: () => void
  errors: SignInErrorState
  hasErrors: () => boolean
  validateOnChange: (field: SignInViaPwFormField) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => void
}

export function signInViaPasswordCreateStateManagement(): SignInViaPasswordStateManagement {
  const state = createSignInUiState()
  const errors = createSignInErrorState()
  return {
    state,
    fillTestData: () => fillTestData(state, errors),
    errors,
    hasErrors: () => hasErrors(errors),
    validateOnChange: (field: SignInViaPwFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, state, errors),
  }
}

function hasErrors(errors: SignInErrorState): boolean {
  return !!errors.email.get() || !!errors.password.get()
}

function validateOnChange(field: SignInViaPwFormField, state: SignInUiState, errors: SignInErrorState) {
  return debounce((value: string) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

async function handleSubmit(e: SubmitEvent, state: SignInUiState, errors: SignInErrorState) {
  e.preventDefault()

  if (state.isSubmitting.get()) {
    const title = ttt("Submission in progress, please wait")
    console.info(title)
    return
  }

  const email = state.email.get()
  const password = state.password.get()

  const emailResult = validateFieldResult("email", email)
  const passwordResult = validateFieldResult("password", password)

  if (!emailResult.success) {
    errors.email.set(emailResult.issues[0].message)
  } else errors.email.set("")
  if (!passwordResult.success) {
    errors.password.set(passwordResult.issues[0].message)
  } else errors.password.set("")

  const isSuccess = emailResult.success && passwordResult.success
  if (!isSuccess) {
    return
  }

  console.log("Sign in via password submitted", {
    email: state.email.get(),
    password: state.password.get(),
  })

  state.isSubmitting.set(true)
  const result = await apiAuthSignInViaPw({ email, pw: password })
  state.isSubmitting.set(false)
  const op = "handleSubmit.apiAuthSignInViaPw"
  posthog.capture(op, result)

  if (!result.success) {
    const errorMessage = ttt("Error signing in")
    console.error(op, errorMessage, result)
    toastAdd({ title: errorMessage, description: result.errorMessage })
    return
  }
  toastAdd({ title: ttt("Successfully signed in"), variant: toastVariant.success })

  const userSession = result.data
  signInSessionNew(userSession)
  console.log("Signed in via password successfully")
}

function validateFieldResult(field: keyof SignInFormData, value: string) {
  const schema = field === "email" ? emailSchema : passwordSchema
  return a.safeParse(schema, value)
}
