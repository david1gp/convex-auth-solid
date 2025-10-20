import { createSignalObject, type SignalObject } from "~ui/utils/ui/createSignalObject"

export type SignInUiState = {
  email: SignalObject<string>
  password: SignalObject<string>
  rememberMe: SignalObject<boolean>
  emailError: SignalObject<string>
  passwordError: SignalObject<string>
  isSubmitting: SignalObject<boolean>
}

export function createSignInUiState(): SignInUiState {
  return {
    email: createSignalObject(""),
    password: createSignalObject(""),
    rememberMe: createSignalObject(false),
    emailError: createSignalObject(""),
    passwordError: createSignalObject(""),
    isSubmitting: createSignalObject(false),
  }
}
