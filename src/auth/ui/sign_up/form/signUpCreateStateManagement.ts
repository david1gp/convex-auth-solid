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

export type SignUpFormField = keyof typeof signUpFormField

export const signUpFormField = {
  name: "name",
  email: "email",
  pw: "pw",
  terms: "terms",
} as const

export const signUpFormFieldIcon = {
  name: mdiAccountCancel,
  email: mdiEmailOff,
  pw: mdiLockOff,
  terms: mdiCheckboxBlankOff,
} as const satisfies Record<SignUpFormField, string>

export type SignUpUiState = {
  name: SignalObject<string>
  email: SignalObject<string>
  pw: SignalObject<string>
  terms: SignalObject<boolean>
  alreadyRegisteredEmails: SignalObject<Set<string>>
}

export function createSignUpUiState(searchParams: SearchParamsObject): SignUpUiState {
  return {
    name: createSignalObject(""),
    email: createSearchParamSignalObject(signUpFormField.email, searchParams),
    pw: createSignalObject(""),
    terms: createSignalObject(false),
    alreadyRegisteredEmails: createSignalObject(new Set<string>()),
  }
}

export type SignUpErrorState = {
  name: SignalObject<string>
  email: SignalObject<string>
  pw: SignalObject<string>
  terms: SignalObject<string>
}

export function createSignUpErrorState(): SignUpErrorState {
  return {
    name: createSignalObject(""),
    email: createSignalObject(""),
    pw: createSignalObject(""),
    terms: createSignalObject(""),
  }
}

export type SignUpFormData = {
  name: string
  email: string
  pw: string
}

export type SignUpUiStateManagement = {
  isSubmitting: SignalObject<boolean>
  state: SignUpUiState
  errors: SignUpErrorState
  hasErrors: () => boolean
  fillTestData: () => void
  validateOnChange: (field: SignUpFormField) => Scheduled<[value: string | boolean]>
  handleSubmit: (e: SubmitEvent) => void
}

type NavigateType = (to: string) => void

export function signUpCreateStateManagement(
  navigate: NavigateType,
  searchParams: SearchParamsObject,
): SignUpUiStateManagement {
  const isSubmitting = createSignalObject(false)
  const state = createSignUpUiState(searchParams)
  const errors = createSignUpErrorState()

  return {
    isSubmitting,
    state,
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: SignUpFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, navigate, isSubmitting, state, errors),
  }
}

function hasErrors(errors: SignUpErrorState): boolean {
  return !!errors.email.get() || !!errors.name.get() || !!errors.pw.get() || !!errors.terms.get()
}

function fillTestData(state: SignUpUiState, errors: SignUpErrorState) {
  state.name.set("Test Name")
  state.email.set("test@example.com")
  state.pw.set("121212121212")
  state.terms.set(true)
  for (const field of Object.values(signUpFormField)) {
    updateFieldError(field, state[field].get(), state, errors)
  }
}

function updateFieldError(
  field: SignUpFormField,
  value: string | boolean,
  state: SignUpUiState,
  errors: SignUpErrorState,
) {
  const result = validateFieldResult(field, value)
  const errorSig = errors[field as keyof typeof errors]
  if (result.success) {
    if (field === signUpFormField.email) {
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
}

function validateOnChange(field: SignUpFormField, state: SignUpUiState, errors: SignUpErrorState) {
  return debounce((value: string | boolean) => {
    updateFieldError(field, value, state, errors)
  }, debounceMs)
}

function handleSubmit(
  e: SubmitEvent,
  navigate: NavigateType,
  isSubmitting: SignalObject<boolean>,
  state: SignUpUiState,
  errors: SignUpErrorState,
) {
  e.preventDefault()

  const name = state.name.get()
  const email = state.email.get()
  const pw = state.pw.get()
  const terms = state.terms.get()

  const nameResult = validateFieldResult(signUpFormField.name, name)
  const emailResult = validateFieldResult(signUpFormField.email, email)
  const pwResult = validateFieldResult(signUpFormField.pw, pw)
  const termsResult = validateFieldResult(signUpFormField.terms, terms)

  if (!nameResult.success) {
    errors.name.set(nameResult.issues[0].message)
  } else errors.name.set("")
  if (!emailResult.success) {
    errors.email.set(emailResult.issues[0].message)
  } else errors.email.set("")
  if (!pwResult.success) {
    errors.pw.set(pwResult.issues[0].message)
  } else errors.pw.set("")
  if (!termsResult.success) {
    errors.terms.set(termsResult.issues[0].message)
  } else errors.terms.set("")

  const isSuccess = nameResult.success && emailResult.success && pwResult.success && termsResult.success

  if (!isSuccess) {
    if (!nameResult.success) {
      toastAdd({ title: nameResult.issues[0].message, icon: signUpFormFieldIcon.name, id: signUpFormField.name })
    }
    if (!emailResult.success) {
      toastAdd({ title: emailResult.issues[0].message, icon: signUpFormFieldIcon.email, id: signUpFormField.email })
    }
    if (!pwResult.success) {
      toastAdd({ title: pwResult.issues[0].message, icon: signUpFormFieldIcon.pw, id: signUpFormField.pw })
    }
    if (!termsResult.success) {
      toastAdd({ title: termsResult.issues[0].message, icon: signUpFormFieldIcon.terms, id: signUpFormField.terms })
    }
    return
  }

  isSubmitting.set(true)

  const formData: SignUpFormData = {
    name: name,
    email: email,
    pw: pw,
  }
  handleSignUp(formData, navigate, state, errors)

  isSubmitting.set(false)
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
  pw: string
}

function validateFieldResult(field: SignUpFormField, value: string | boolean) {
  let schema
  if (field === signUpFormField.name) {
    schema = signUpNameSchema
  } else if (field === signUpFormField.email) {
    schema = emailSchema
  } else if (field === signUpFormField.pw) {
    schema = passwordSchema
  } else if (field === signUpFormField.terms) {
    schema = signUpTermsSchema
    return v.safeParse(schema, value as boolean)
  }
  return v.safeParse(schema!, value as string)
}
