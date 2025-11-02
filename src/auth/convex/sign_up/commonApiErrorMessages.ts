import { stt } from "@/utils/i18n/stt"

export const commonApiErrorMessages = {
  methodNotAllowed: stt("Method not allowed"),
  emptyBody: stt("Empty body"),
  schemaValidationFailed: stt("Schema validation failed"),
} as const
