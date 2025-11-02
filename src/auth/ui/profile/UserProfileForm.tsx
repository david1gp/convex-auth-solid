import { userProfileFormField } from "@/auth/ui/profile/userProfileFormField"
import { DateView } from "@/ui/date/DateView"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formModeViewIsReadOnly, type FormModeView } from "~ui/input/form/formMode"
import { Input } from "~ui/input/input/Input"
import { Label } from "~ui/input/label/Label"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import type { UserProfileFormStateManagement } from "./userProfileFormState"

interface HasUserProfileFormStateManagement {
  sm: UserProfileFormStateManagement
}

export interface UserProfileFormProps extends MayHaveClass, HasUserProfileFormStateManagement {
  mode: FormModeView
}

export function UserProfileForm(p: UserProfileFormProps) {
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{getUserProfileTitle(p.mode)}</h1>
      <form class="space-y-4">
        <UserIdField sm={p.sm} />
        <NameField sm={p.sm} />
        <UsernameField sm={p.sm} />
        <ImageField sm={p.sm} />
        <EmailField sm={p.sm} />
        <RoleField sm={p.sm} />
        <OrgHandleField sm={p.sm} />
        <OrgRoleField sm={p.sm} />
        <CreatedAtField sm={p.sm} />
      </form>
    </section>
  )
}

function UserIdField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.userId}>{ttt("User ID")}</Label>
      <Input
        id={userProfileFormField.userId}
        value={p.sm.state.userId.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        autocomplete="off"
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
    </div>
  )
}

function NameField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.name}>{ttt("Name")}</Label>
      <Input
        id={userProfileFormField.name}
        value={p.sm.state.name.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        autocomplete="name"
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
    </div>
  )
}

function UsernameField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.username}>{ttt("Username")}</Label>
      <Input
        id={userProfileFormField.username}
        value={p.sm.state.username.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        autocomplete="username"
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
    </div>
  )
}

function ImageField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.image}>{ttt("Image URL")}</Label>
      <Input
        id={userProfileFormField.image}
        type="url"
        value={p.sm.state.image.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        autocomplete="url"
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
      <Show when={p.sm.state.image.get()}>
        <img src={p.sm.state.image.get()} alt="Profile" class="w-16 h-16 rounded-full mt-2" />
      </Show>
    </div>
  )
}

function EmailField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.email}>{ttt("Email")}</Label>
      <Input
        id={userProfileFormField.email}
        type="email"
        value={p.sm.state.email.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        autocomplete="email"
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
    </div>
  )
}

function RoleField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.role}>{ttt("Role")}</Label>
      <Input
        id={userProfileFormField.role}
        value={p.sm.state.role.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
    </div>
  )
}

function OrgHandleField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.orgHandle}>{ttt("Organization Handle")}</Label>
      <Input
        id={userProfileFormField.orgHandle}
        value={p.sm.state.orgHandle.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        autocomplete="organization-name"
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
    </div>
  )
}

function OrgRoleField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.orgRole}>{ttt("Organization Role")}</Label>
      <Input
        id={userProfileFormField.orgRole}
        value={p.sm.state.orgRole.get()}
        readOnly={formModeViewIsReadOnly(p.sm.mode)}
        class="w-full bg-gray-50 dark:bg-gray-800"
      />
    </div>
  )
}

function CreatedAtField(p: HasUserProfileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={userProfileFormField.createdAt}>{ttt("Created At")}</Label>
      <DateView date={p.sm.state.createdAt.get()} class="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded" />
    </div>
  )
}

function getUserProfileTitle(mode: FormModeView): string {
  // return getFormTitle(mode, ttt("User Profile"))
  return ttt("User Profile")
}
