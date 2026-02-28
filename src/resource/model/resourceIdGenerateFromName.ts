import { generateFilIdDatePart } from "@/file/model_field/fileIdGenerate"
import { generateId10 } from "~utils/ran/generateId10"
import { generateId20 } from "~utils/ran/generateId20"

export const resourceIdNamCutoffLength = 50

export function resourceIdGenerateFromName(fullName: string, now = new Date()): string {
  const datePart = generateFilIdDatePart(now)

  const namePartFromName = fullName
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")
    .replace(/[^A-Za-z0-9_]/g, "-")
    .replaceAll("_.", ".")
    .replaceAll("-.", ".")
    .replace(/-_|_-/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const cutoffName50 =
    namePartFromName.length > resourceIdNamCutoffLength
      ? namePartFromName.substring(0, resourceIdNamCutoffLength)
      : namePartFromName
  return `${datePart}_${cutoffName50}_${cutoffName50.length <= 9 ? generateId20() : generateId10()}`
}
