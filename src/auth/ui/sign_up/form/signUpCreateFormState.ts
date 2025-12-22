import { apiAuthSignUp } from "@/auth/api/apiAuthSignUp"
import type { SignUpType } from "@/auth/model/signUpSchema"
import { signUpTermsSchema } from "@/auth/model/signUpTermsSchema"
import { passwordSchema } from "@/auth/model_field/passwordSchema"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { urlSignUpConfirmEmail } from "@/auth/url/urlSignUpConfirmEmail"
import { navigateTo } from "@/utils/router/navigateTo"
import { searchParamGet } from "@/utils/router/searchParamGet"
import { debounceMs } from "@/utils/ui/debounceMs"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { stringSchemaName } from "@/utils/valibot/stringSchema"
import { mdiAccountCancel, mdiCheckboxBlankOff, mdiEmailOff, mdiLockOff } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import posthog from "posthog-js"
import * as a from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
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

export function signUpCreateFormState(): SignUpUiState {
  return {
    name: createSignalObject(""),
    email: createSignalObject(""),
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

export type SignUpFormState = {
  state: SignUpUiState
  isSubmitting: SignalObject<boolean>
  errors: SignUpErrorState
}

export interface SignUpUiStateManagement extends SignUpFormState {
  hasErrors: () => boolean
  fillTestData: () => void
  validateOnChange: (field: SignUpFormField) => Scheduled<[value: string | boolean]>
  handleSubmit: (e: SubmitEvent) => void
}

type NavigateType = (to: string) => void

export function signUpCreateStateManagement(): SignUpUiStateManagement {
  const isSubmitting = createSignalObject(false)
  const state = signUpCreateFormState()
  const errors = createSignUpErrorState()
  const s: SignUpFormState = { isSubmitting, state, errors }

  return {
    isSubmitting,
    state,
    errors,
    hasErrors: () => hasErrors(errors),
    fillTestData: () => fillTestData(state, errors),
    validateOnChange: (field: SignUpFormField) => validateOnChange(field, state, errors),
    handleSubmit: (e: SubmitEvent) => handleSubmit(e, s),
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

async function handleSubmit(e: SubmitEvent, s: SignUpFormState) {
  e.preventDefault()

  const isSubmitting = s.isSubmitting.get()
  if (isSubmitting) {
    const title = ttt("Submission in progress, please wait")
    console.info(title)
    toastAdd({ title, variant: toastVariant.default, id: "isSubmitting" })
    return
  }

  const name = s.state.name.get()
  const email = s.state.email.get()
  const pw = s.state.pw.get()
  const terms = s.state.terms.get()

  const nameResult = validateFieldResult(signUpFormField.name, name)
  const emailResult = validateFieldResult(signUpFormField.email, email)
  const pwResult = validateFieldResult(signUpFormField.pw, pw)
  const termsResult = validateFieldResult(signUpFormField.terms, terms)

  if (!nameResult.success) {
    s.errors.name.set(nameResult.issues[0].message)
  } else s.errors.name.set("")
  if (!emailResult.success) {
    s.errors.email.set(emailResult.issues[0].message)
  } else s.errors.email.set("")
  if (!pwResult.success) {
    s.errors.pw.set(pwResult.issues[0].message)
  } else s.errors.pw.set("")
  if (!termsResult.success) {
    s.errors.terms.set(termsResult.issues[0].message)
  } else s.errors.terms.set("")

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

  s.isSubmitting.set(true)

  const formData: SignUpType = {
    name: name,
    email: email,
    pw: pw,
    l: "en",
  }
  await handleSignUp(formData, s)

  s.isSubmitting.set(false)
}

async function handleSignUp(values: HandleSignUpData, s: SignUpFormState) {
  const op = "handleSignUp"
  // console.log("Sign up with email/password:", values)
  const result = await apiAuthSignUp(values)
  posthog.capture(op, result)
  if (!result.success) {
    console.error(result)
    const title = result.errorMessage
    toastAdd({ id: "signup-api-error", title, icon: mdiAccountCancel })
    if (result.statusCode === 409) {
      const currentSet = s.state.alreadyRegisteredEmails.get()
      const newSet = new Set([...currentSet, values.email])
      s.state.alreadyRegisteredEmails.set(newSet)
      const errorMessage = ttt("Email already registered, please sign in instead")
      s.errors.email.set(errorMessage)
      return
    }
    return
  }
  toastAdd({ title: ttt("Successfully signed up"), variant: toastVariant.success })
  const returnPathSearch = searchParamGet("returnPath")
  const returnPath = returnPathSearch || urlSignInRedirectUrl(location.pathname)
  console.log(op, "returnPath:", returnPath)
  navigateTo(urlSignUpConfirmEmail(values.email, "", returnPath))
}

export type HandleSignUpData = {
  name: string
  email: string
  pw: string
  l: string
}

function validateFieldResult(field: SignUpFormField, value: string | boolean) {
  let schema
  if (field === signUpFormField.name) {
    schema = stringSchemaName
  } else if (field === signUpFormField.email) {
    schema = emailSchema
  } else if (field === signUpFormField.pw) {
    schema = passwordSchema
  } else if (field === signUpFormField.terms) {
    schema = signUpTermsSchema
    return a.safeParse(schema, value as boolean)
  }
  return a.safeParse(schema!, value as string)
}
