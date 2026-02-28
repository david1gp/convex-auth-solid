import type { UserProfile } from "@/auth/model/UserProfile"
import type { UserRole } from "@/auth/model_field/userRole"
import type { OrgRole } from "@/org/org_model_field/orgRole"
import type { FormMode } from "~ui/input/form/formMode"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"

export type UserProfileFormData = {
  userId: string
  name: string
  username?: string
  image?: string
  email?: string
  role: UserRole
  orgHandle?: string
  orgRole?: OrgRole
  bio?: string
  url?: string
  createdAt: string
}

export type UserProfileFormState = {
  userId: SignalObject<string>
  name: SignalObject<string>
  username: SignalObject<string>
  image: SignalObject<string>
  email: SignalObject<string>
  role: SignalObject<UserRole>
  orgHandle: SignalObject<string>
  orgRole: SignalObject<OrgRole>
  bio: SignalObject<string>
  url: SignalObject<string>
  createdAt: SignalObject<string>
}

export type UserProfileFormErrorState = {
  userId: SignalObject<string>
  name: SignalObject<string>
  username: SignalObject<string>
  image: SignalObject<string>
  email: SignalObject<string>
  role: SignalObject<string>
  orgHandle: SignalObject<string>
  orgRole: SignalObject<string>
  bio: SignalObject<string>
  url: SignalObject<string>
  createdAt: SignalObject<string>
}

function userProfileCreateState(): UserProfileFormState {
  return {
    userId: createSignalObject(""),
    name: createSignalObject(""),
    username: createSignalObject(""),
    image: createSignalObject(""),
    email: createSignalObject(""),
    role: createSignalObject("user" as UserRole),
    orgHandle: createSignalObject(""),
    orgRole: createSignalObject("member" as OrgRole),
    bio: createSignalObject(""),
    url: createSignalObject(""),
    createdAt: createSignalObject(""),
  }
}

function userProfileCreateErrorState(): UserProfileFormErrorState {
  return {
    userId: createSignalObject(""),
    name: createSignalObject(""),
    username: createSignalObject(""),
    image: createSignalObject(""),
    email: createSignalObject(""),
    role: createSignalObject(""),
    orgHandle: createSignalObject(""),
    orgRole: createSignalObject(""),
    bio: createSignalObject(""),
    url: createSignalObject(""),
    createdAt: createSignalObject(""),
  }
}

export type UserProfileFormStateManagement = {
  mode: FormMode
  isSaving: SignalObject<boolean>
  serverState: SignalObject<UserProfile>
  state: UserProfileFormState
  errors: UserProfileFormErrorState
  hasErrors: () => boolean
  loadData: (data: UserProfile) => void
}

export type UserProfileFormActions = {}

export function userProfileFormStateManagement(
  mode: FormMode,
  actions: UserProfileFormActions,
): UserProfileFormStateManagement {
  const serverState = createSignalObject({} as UserProfile)
  const isSaving = createSignalObject(false)
  const state = userProfileCreateState()
  const errors = userProfileCreateErrorState()

  return {
    mode,
    isSaving,
    serverState,
    state,
    loadData: (data: UserProfile) => loadData(data, serverState, state),
    errors,
    hasErrors: () => hasErrors(errors),
  }
}

function loadData(data: UserProfile, serverState: SignalObject<UserProfile>, state: UserProfileFormState): void {
  serverState.set(data)
  state.userId.set(data.userId)
  state.name.set(data.name)
  state.username.set(data.username ?? "")
  state.image.set(data.image ?? "")
  state.email.set(data.email ?? "")
  state.role.set(data.role)
  state.orgHandle.set(data.orgHandle ?? "")
  state.orgRole.set(data.orgRole ?? ("member" as OrgRole))
  state.bio.set(data.bio ?? "")
  state.url.set(data.url ?? "")
  state.createdAt.set(data.createdAt)
  console.log("loaded user profile data", data)
}

function hasErrors(errors: UserProfileFormErrorState) {
  return (
    !!errors.userId.get() ||
    !!errors.name.get() ||
    !!errors.username.get() ||
    !!errors.image.get() ||
    !!errors.email.get() ||
    !!errors.role.get() ||
    !!errors.orgHandle.get() ||
    !!errors.orgRole.get() ||
    !!errors.bio.get() ||
    !!errors.url.get() ||
    !!errors.createdAt.get()
  )
}
