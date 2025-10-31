import * as v from "valibot"
import { inputMaxLength25 } from "~ui/input/input/inputMaxLength"

const regexMessage1 = "must only consist of lowercase letters, digits and hyphens"
const regexMessage2 = "no consecutive hyphens"
const regexMessage3 = "no leading hyphens"
const regexMessage4 = "no trailing hyphens"

export const handleSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty(),
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
