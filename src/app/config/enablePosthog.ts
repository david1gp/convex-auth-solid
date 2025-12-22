import { isProdEnv } from "@/utils/env/isProdEnv"

export function enablePosthog() {
  // return true
  // return false
  return isProdEnv()
}
