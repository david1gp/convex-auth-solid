import { createSignalObject, type SignalObject } from "~ui/utils/ui/createSignalObject"

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
