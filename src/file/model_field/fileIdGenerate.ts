import { fileNameGetNameAndEnding } from "@/file/model_field/fileNameGetNameAndEnding"
import { generateId20 } from "~utils/ran/generateId20"

export function fileIdGenerate(name: string, now = new Date()): string {
  const datePart = generateFilIdDatePart(now)
  const namePart = generateId20()
  const [, ending] = fileNameGetNameAndEnding(name)
  return `${datePart}_${namePart}${ending}`
}

export function generateFilIdDatePart(now = new Date()) {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
