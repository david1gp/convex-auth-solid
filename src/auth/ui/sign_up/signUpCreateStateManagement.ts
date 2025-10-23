import { apiAuthSignUp } from "@/auth/api/apiAuthSignUp"
import { emailSchema, passwordSchema, signUpNameSchema, signUpTermsSchema } from "@/auth/model/emailSchema"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { urlSignUpConfirmEmail } from "@/auth/url/urlSignUpConfirmEmail"
import { mdiAccountCancel } from "@mdi/js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"
import * as v from "valibot"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type SignUpUiState = {
  isSubmitting: SignalObject<boolean>
  name: SignalObject<string>
  email: SignalObject<string>
  password: SignalObject<string>
  terms: SignalObject<boolean>
}

export function createSignUpUiState(): SignUpUiState {
  return {
    isSubmitting: createSignalObject(false),
    name: createSignalObject(""),
    email: createSignalObject(""),
    password: createSignalObject(""),
    terms: createSignalObject(false),
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
  fillTestData: () => void
  validateOnChange: (field: keyof SignUpFormData) => Scheduled<[value: string | boolean]>
  handleSubmit: (e: SubmitEvent) => void
}

const debounceMs = 250

type NavigateType = (to: string) => void

export function signUpCreateStateManagement(navigate: NavigateType): SignUpUiStateManagement {
  const state = createSignUpUiState()
  const errors = createSignUpErrorState()

  function fillTestData() {
    state.name.set("Test Name")
    state.email.set("test@example.com")
    state.password.set("121212121212")
    state.terms.set(true)
  }

  function validateOnChange(field: keyof SignUpFormData) {
    return debounce((value: string | boolean) => {
      const result = validateField(field, value)
      const errorSig = errors[field as keyof typeof errors]
      if (result.success) {
        errorSig.set("")
      } else {
        errorSig.set(result.issues[0].message)
      }
    }, debounceMs)
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    state.isSubmitting.set(true)

    const formData: SignUpFormData = {
      name: state.name.get(),
      email: state.email.get(),
      password: state.password.get(),
      terms: state.terms.get(),
    }

    // Validate all fields
    const nameResult = validateField("name", formData.name)
    const emailResult = validateField("email", formData.email)
    const passwordResult = validateField("password", formData.password)
    const termsResult = validateField("terms", formData.terms)

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
      // p.onSubmit(formData)
      handleSignUp(formData, navigate)
    }
    state.isSubmitting.set(false)
  }

  return {
    state,
    errors,
    fillTestData,
    validateOnChange,
    handleSubmit,
  }
}

export type HandleSignUpData = {
  name: string
  email: string
  password?: string | undefined
  terms: boolean
}

async function handleSignUp(values: HandleSignUpData, navigate: NavigateType) {
  // console.log("Sign up with email/password:", values)
  const result = await apiAuthSignUp(values)
  if (!result.success) {
    console.error(result)
    const title = result.errorMessage
    toastAdd({ title, icon: mdiAccountCancel })
    return
  }
  const returnPath = urlSignInRedirectUrl(location.pathname)
  console.log(returnPath)
  navigate(urlSignUpConfirmEmail(values.email, "", returnPath))
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
