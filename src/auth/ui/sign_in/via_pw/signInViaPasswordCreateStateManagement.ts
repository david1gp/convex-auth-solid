import { debounceMs } from "@/utils/ui/debounceMs"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import type { SearchParamsObject } from "~ui/utils/router/SearchParamsObject"
import { createSearchParamSignalObject } from "~ui/utils/router/createSearchParamSignalObject"
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

function handleSubmit(e: SubmitEvent, state: SignInUiState, errors: SignInErrorState) {
  e.preventDefault()
  state.isSubmitting.set(true)

  const emailResult = validateField("email", state.email.get())
  const passwordResult = validateField("password", state.password.get())

  if (!emailResult.success) {
    errors.email.set(emailResult.issues[0].message)
  } else errors.email.set("")
  if (!passwordResult.success) {
    errors.password.set(passwordResult.issues[0].message)
  } else errors.password.set("")

  if (emailResult.success && passwordResult.success) {
    console.log("Sign in via password submitted", {
      email: state.email.get(),
      password: state.password.get(),
    })
  }
  state.isSubmitting.set(false)
}

function validateField(field: keyof SignInFormData, value: string) {
  const schema = field === "email" ? emailSchema : passwordSchema
  return v.safeParse(schema, value)
}
