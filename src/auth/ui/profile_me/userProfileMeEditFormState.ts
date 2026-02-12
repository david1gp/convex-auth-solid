import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type UserProfileMeEditFormState = {
  name: SignalObject<string>
  bio: SignalObject<string>
  url: SignalObject<string>
}

export type UserProfileMeEditFormErrorState = {
  name: SignalObject<string>
  bio: SignalObject<string>
  url: SignalObject<string>
}

export type UserProfileMeEditFormStateManagement = {
  initialData: { name: string; bio: string; url: string }
  isLoading: SignalObject<boolean>
  state: UserProfileMeEditFormState
  errors: UserProfileMeEditFormErrorState
  hasErrors: () => boolean
  getChangedFields: () => { name?: string; bio?: string; url?: string }
}

function userProfileMeEditCreateState(initialData: { name: string; bio: string; url: string }): UserProfileMeEditFormState {
  return {
    name: createSignalObject(initialData.name),
    bio: createSignalObject(initialData.bio),
    url: createSignalObject(initialData.url),
  }
}

function userProfileMeEditCreateErrorState(): UserProfileMeEditFormErrorState {
  return {
    name: createSignalObject(""),
    bio: createSignalObject(""),
    url: createSignalObject(""),
  }
}

export function userProfileMeEditFormStateManagement(
  initialData: { name: string; bio: string; url: string },
): UserProfileMeEditFormStateManagement {
  const isLoading = createSignalObject(false)
  const state = userProfileMeEditCreateState(initialData)
  const errors = userProfileMeEditCreateErrorState()

  return {
    initialData,
    isLoading,
    state,
    errors,
    hasErrors: () => hasErrors(errors),
    getChangedFields: () => getChangedFields(state, initialData),
  }
}

function hasErrors(errors: UserProfileMeEditFormErrorState): boolean {
  return !!errors.name.get() || !!errors.bio.get() || !!errors.url.get()
}

function getChangedFields(state: UserProfileMeEditFormState, initialData: { name: string; bio: string; url: string }): { name?: string; bio?: string; url?: string } {
  const result: { name?: string; bio?: string; url?: string } = {}

  if (state.name.get() !== initialData.name) {
    result.name = state.name.get()
  }
  if (state.bio.get() !== initialData.bio) {
    result.bio = state.bio.get()
  }
  if (state.url.get() !== initialData.url) {
    result.url = state.url.get()
  }

  return result
}
