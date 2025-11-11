import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import { inputMaxLength50 } from "@/utils/valibot/inputMaxLength"
import * as a from "valibot"

const regexMessage1 = "Must only consist of latin letters, digits and hyphens"
const regexMessage2 = "No consecutive hyphens"
const regexMessage3 = "No leading hyphens"
const regexMessage4 = "No trailing hyphens"

export const orgHandleSchema = a.pipe(
  a.string(),
  a.trim(),
  a.nonEmpty(cantBeEmpty),
  a.minLength(3),
  a.regex(/^[a-zA-Z0-9-]+$/, regexMessage1),
  a.regex(/^(?!.*--)/, regexMessage2),
  a.regex(/^[^-]/, regexMessage3),
  a.regex(/[^-]$/, regexMessage4),
  a.maxLength(inputMaxLength50),
)

export function orgHandleGenerate(name: string) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
