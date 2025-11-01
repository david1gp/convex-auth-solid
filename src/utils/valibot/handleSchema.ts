import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import * as v from "valibot"
import { inputMaxLength25 } from "~ui/input/input/inputMaxLength"

const regexMessage1 = "Must only consist of lowercase letters, digits and hyphens"
const regexMessage2 = "No consecutive hyphens"
const regexMessage3 = "No leading hyphens"
const regexMessage4 = "No trailing hyphens"

export const handleSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty(cantBeEmpty),
  v.minLength(3),
  v.regex(/^[a-z0-9-]+$/, regexMessage1),
  v.regex(/^(?!.*--)/, regexMessage2),
  v.regex(/^[^-]/, regexMessage3),
  v.regex(/[^-]$/, regexMessage4),
  v.maxLength(inputMaxLength25),
)

export function handleGenerate(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
