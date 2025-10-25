import { apiAuthSignUp } from "@/auth/api/apiAuthSignUp"
import { emailSchema, passwordSchema, signUpNameSchema, signUpTermsSchema } from "@/auth/model/emailSchema"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { urlSignUpConfirmEmail } from "@/auth/url/urlSignUpConfirmEmail"
import { debounceMs } from "@/utils/ui/debounceMs"
import { createSearchParamSignalObject } from "@/utils/ui/router/createSearchParamSignalObject"
import type { SearchParamsObject } from "@/utils/ui/router/SearchParamsObject"
import { mdiAccountCancel, mdiCheckboxBlankOff, mdiEmailOff, mdiLockOff } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type SignUpUiState = {
  isSubmitting: SignalObject<boolean>
  name: SignalObject<string>
  email: SignalObject<string>
  password: SignalObject<string>
  terms: SignalObject<boolean>
  alreadyRegisteredEmails: SignalObject<Set<string>>
}

export function createSignUpUiState(searchParams: SearchParamsObject): SignUpUiState {
  return {
    isSubmitting: createSignalObject(false),
    name: createSignalObject(""),
    email: createSearchParamSignalObject("email", searchParams),
    password: createSignalObject(""),
    terms: createSignalObject(false),
    alreadyRegisteredEmails: createSignalObject(new Set<string>()),
  }
}

export type SignUpErrorState = {
  name: SignalObject<string>
  email: SignalObject<string>
  password: SignalObject<string>
  terms: SignalObject<string>
}

export function createSignUpErrorState(): SignUpErrorState {
  return {
    name: createSignalObject(""),
    email: createSignalObject(""),
    password: createSignalObject(""),
    terms: createSignalObject(""),
  }
}

export type SignUpFormData = {
  name: string
  email: string
  password: string
  terms: boolean
}

export type SignUpUiStateManagement = {
  state: SignUpUiState
  errors: SignUpErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  validateOnChange: (field: keyof SignUpFormData) => Scheduled<[value: string | boolean]>
  handleSubmit: (e: SubmitEvent) => void
}

type NavigateType = (to: string) => void

export function signUpCreateStateManagement(
  navigate: NavigateType,
  searchParams: SearchParamsObject,
): SignUpUiStateManagement {
  const state = createSignUpUiState(searchParams)
  const errors = createSignUpErrorState()

  return {
    state,
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state),
    validateOnChange: (field: keyof SignUpFormData) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, navigate, state, errors),
  }
}

function hasErrors(errors: SignUpErrorState): boolean {
  // console.log("hasErrors",{errors:errors.email})
  return !!errors.email.get() || !!errors.name.get() || !!errors.password.get() || !!errors.terms.get()
}

function fillTestData(state: SignUpUiState) {
  state.name.set("Test Name")
  state.email.set("test@example.com")
  state.password.set("121212121212")
  state.terms.set(true)
}

function validateOnChange(field: keyof SignUpFormData, state: SignUpUiState, errors: SignUpErrorState) {
  return debounce((value: string | boolean) => {
    const result = validateField(field, value)
    const errorSig = errors[field as keyof typeof errors]
    if (result.success) {
      if (field === "email") {
        const emailValue = value as string
        if (state.alreadyRegisteredEmails.get().has(emailValue)) {
          errorSig.set("Email already registered, please sign in instead")
          return
        }
      }
      errorSig.set("")
    } else {
      errorSig.set(result.issues[0].message)
    }
  }, debounceMs)
}

function handleSubmit(e: SubmitEvent, navigate: NavigateType, state: SignUpUiState, errors: SignUpErrorState) {
  e.preventDefault()
  state.isSubmitting.set(true)

  const nameResult = validateField("name", state.name.get())
  const emailResult = validateField("email", state.email.get())
  const passwordResult = validateField("password", state.password.get())
  const termsResult = validateField("terms", state.terms.get())

  if (!nameResult.success) {
    errors.name.set(nameResult.issues[0].message)
  } else errors.name.set("")
  if (!emailResult.success) {
    errors.email.set(emailResult.issues[0].message)
  } else errors.email.set("")
  if (!passwordResult.success) {
    errors.password.set(passwordResult.issues[0].message)
  } else errors.password.set("")
  if (!termsResult.success) {
    errors.terms.set(termsResult.issues[0].message)
  } else errors.terms.set("")

  if (nameResult.success && emailResult.success && passwordResult.success && termsResult.success) {
    const formData: SignUpFormData = {
      name: state.name.get(),
      email: state.email.get(),
      password: state.password.get(),
      terms: state.terms.get(),
    }
    handleSignUp(formData, navigate, state, errors)
  } else {
    if (!nameResult.success) {
      toastAdd({ title: nameResult.issues[0].message, icon: mdiAccountCancel, id: "name" })
    }
    if (!emailResult.success) {
      toastAdd({ title: emailResult.issues[0].message, icon: mdiEmailOff, id: "email" })
    }
    if (!passwordResult.success) {
      toastAdd({ title: passwordResult.issues[0].message, icon: mdiLockOff, id: "password" })
    }
    if (!termsResult.success) {
      toastAdd({ title: termsResult.issues[0].message, icon: mdiCheckboxBlankOff, id: "terms" })
    }
  }
  state.isSubmitting.set(false)
}

async function handleSignUp(
  values: HandleSignUpData,
  nav: NavigateType,
  state: SignUpUiState,
  errors: SignUpErrorState,
) {
  // console.log("Sign up with email/password:", values)
  const result = await apiAuthSignUp(values)
  if (!result.success) {
    console.error(result)
    const title = result.errorMessage
    toastAdd({ id: "signup-api-error", title, icon: mdiAccountCancel })
    if (result.statusCode === 409) {
      const currentSet = state.alreadyRegisteredEmails.get()
      const newSet = new Set([...currentSet, values.email])
      state.alreadyRegisteredEmails.set(newSet)
      const errorMessage = ttt("Email already registered, please sign in instead")
      errors.email.set(errorMessage)
      return
    }
    return
  }
  const returnPath = urlSignInRedirectUrl(location.pathname)
  console.log(returnPath)
  nav(urlSignUpConfirmEmail(values.email, "", returnPath))
}

export type HandleSignUpData = {
  name: string
  email: string
  password?: string | undefined
  terms: boolean
}

function validateField(field: keyof SignUpFormData, value: string | boolean) {
  let schema
  if (field === "name") {
    schema = signUpNameSchema
  } else if (field === "email") {
    schema = emailSchema
  } else if (field === "password") {
    schema = passwordSchema
  } else if (field === "terms") {
    schema = signUpTermsSchema
    return v.safeParse(schema, value as boolean)
  }
  return v.safeParse(schema!, value as string)
}
