import type { FormFieldConfig } from "@/ui/form/formFieldConfigs"
import { formFieldConfigs } from "@/ui/form/formFieldConfigs"
import { ttt } from "~ui/i18n/ttt"

export type UserProfileFormField = keyof typeof userProfileFormField

export const userProfileFormField = {
  // id
  userId: "userId",
  // data
  name: "name",
  username: "username",
  image: "image",
  email: "email",
  bio: "bio",
  url: "url",
  role: "role",
  orgHandle: "orgHandle",
  orgRole: "orgRole",
  createdAt: "createdAt",
} as const

export const userProfileFormConfig = {
  userId: {
    name: "userId",
    label: ttt("User ID"),
    placeholder: ttt("User ID"),
  } as const satisfies FormFieldConfig,

  name: {
    ...formFieldConfigs.name,
    placeholder: ttt("Enter your name"),
  } as const satisfies FormFieldConfig,

  username: {
    name: "username",
    label: ttt("Username"),
    placeholder: ttt("Enter username"),
    autocomplete: "username",
  } as const satisfies FormFieldConfig,

  image: {
    ...formFieldConfigs.image,
    placeholder: ttt("Profile image URL"),
  } as const satisfies FormFieldConfig,

  email: {
    name: "email",
    label: ttt("Email"),
    placeholder: ttt("Enter email address"),
    autocomplete: "email",
  } as const satisfies FormFieldConfig,

  bio: {
    name: "bio",
    label: ttt("Bio"),
    placeholder: ttt("Enter your bio"),
  } as const satisfies FormFieldConfig,

  url: {
    name: "url",
    label: ttt("Website"),
    placeholder: ttt("Enter your website URL"),
  } as const satisfies FormFieldConfig,

  role: {
    name: "role",
    label: ttt("Role"),
    placeholder: ttt("Enter role"),
  } as const satisfies FormFieldConfig,

  orgHandle: {
    name: "orgHandle",
    label: ttt("Organization Handle"),
    placeholder: ttt("Enter organization handle"),
    autocomplete: "organization-name",
  } as const satisfies FormFieldConfig,

  orgRole: {
    name: "orgRole",
    label: ttt("Organization Role"),
    placeholder: ttt("Enter organization role"),
  } as const satisfies FormFieldConfig,

  createdAt: {
    name: "createdAt",
    label: ttt("Created At"),
    placeholder: ttt("Created At"),
  } as const satisfies FormFieldConfig,
} as const satisfies Record<UserProfileFormField, FormFieldConfig>
