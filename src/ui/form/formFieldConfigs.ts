import { inputMaxLengthSummary, inputMaxLengthUrl } from "@/utils/valibot/inputMaxLength"
import type { BaseSchema } from "valibot"
import { ttt } from "~ui/i18n/ttt"

// Pre-configured field types for common use cases

export interface FormFieldConfig {
  name: string
  label: string
  labelClass?:string
  placeholder: string
  subtitle?: string
  subtitleClass?: string
  required?: boolean
  type?: "text" | "password" | "url" | "date" | "datetime-local"
  maxLength?: number
  autocomplete?: string
  class?: string
  disabled?: boolean

  schema?: BaseSchema<any, any, any>
}

export const formFieldConfigs = {
  name: {
    name: "name",
    label: ttt("Name"),
    placeholder: ttt("Enter name"),
  } as const satisfies FormFieldConfig,

  description: {
    name: "description",
    label: ttt("Description"),
    placeholder: ttt("Enter description"),
    maxLength: inputMaxLengthSummary,
  } as const satisfies FormFieldConfig,

  summary: {
    name: "summary",
    label: ttt("Summary"),
    placeholder: ttt("Enter summary"),
    maxLength: inputMaxLengthSummary,
  } as const satisfies FormFieldConfig,

  url: {
    name: "url",
    label: ttt("URL"),
    placeholder: ttt("Enter URL"),
    type: "url",
    maxLength: inputMaxLengthUrl,
    autocomplete: "url",
  } as const satisfies FormFieldConfig,

  image: {
    name: "image",
    label: ttt("Or paste image link (URL) here"),
    placeholder: ttt(
      "Use this only if your image is already online somewhere, e.g., on Google Drive, Imgur, Dropbox, etc.",
    ),
    type: "url",
    maxLength: inputMaxLengthUrl,
    autocomplete: "url",
  } as const satisfies FormFieldConfig,

  date: {
    name: "date",
    label: ttt("Date"),
    placeholder: ttt("Enter date and time"),
    required: true,
    type: "datetime-local",
  } as const satisfies FormFieldConfig,

  email: {
    name: "email",
    label: ttt("Email"),
    placeholder: ttt("Enter email address"),
    autocomplete: "email",
  } as const satisfies FormFieldConfig,
} satisfies Record<string, FormFieldConfig>
