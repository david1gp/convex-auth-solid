import { createSystemDate } from "~utils/date/createDate"
import { tokenValidDurationInDays } from "./tokenValidDurationInDays"

export function createTokenExpirationDate() {
  const d = createSystemDate().add(tokenValidDurationInDays, "days")
  return d.toDate()
}
