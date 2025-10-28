import { apiAuthSignInViaPw } from "@/auth/api/apiAuthSignInViaPw"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { debounceMs } from "@/utils/ui/debounceMs"
import type { SearchParamsObject } from "@/utils/ui/router/SearchParamsObject"
import { createSearchParamSignalObject } from "@/utils/ui/router/createSearchParamSignalObject"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { emailSchema, passwordSchema } from "../../../model/emailSchema"

export type SignInUiState = {
  email: SignalObject<string>
  password: SignalObject<string>
  //
  isSubmitting: SignalObject<boolean>
}

export function createSignInUiState(searchParams: SearchParamsObject): SignInUiState {
  return {
    email: createSearchParamSignalObject("email", searchParams),
    password: createSignalObject(""),
    //
    isSubmitting: createSignalObject(false),
  }
}

function fillTestData(state: SignInUiState) {
  state.email.set("test@example.com")
  state.password.set("121212121212")
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

export type SignInFormData = {
  email: string
  password: string
}

export type SignInViaPasswordStateManagement = {
  state: SignInUiState
  fillTestData: () => void
  errors: SignInErrorState
  hasErrors: () => boolean
  validateOnChange: (field: keyof SignInFormData) => Scheduled<[value: string]>
  handleSubmit: (e: SubmitEvent) => void
}

export function signInViaPasswordCreateStateManagement(
  searchParams: SearchParamsObject,
): SignInViaPasswordStateManagement {
  const state = createSignInUiState(searchParams)
  const errors = createSignInErrorState()
  return {
    state,
    fillTestData: () => fillTestData(state),
    errors,
    hasErrors: () => hasErrors(errors),
    validateOnChange: (field: keyof SignInFormData) => validateOnChange(field, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, state, errors),
  }
}

function hasErrors(errors: SignInErrorState): boolean {
  return !!errors.email.get() || !!errors.password.get()
}

function validateOnChange(field: keyof SignInFormData, errors: SignInErrorState) {
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

async function handleSubmit(e: SubmitEvent, state: SignInUiState, errors: SignInErrorState) {
  e.preventDefault()

  const email = state.email.get()
  const password = state.password.get()

  const emailResult = validateField("email", email)
  const passwordResult = validateField("password", password)

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

  if (!result.success) {
    toastAdd({ title: "Error signing in", description: result.errorMessage })
    return
  }

  const userSession = result.data
  userSessionsSignalAdd(userSession)
  userSessionSignal.set(userSession)
  console.log("Signed in via password successfully")
}

function validateField(field: keyof SignInFormData, value: string) {
  const schema = field === "email" ? emailSchema : passwordSchema
  return v.safeParse(schema, value)
}
