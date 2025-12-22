import { isDevEnv } from "@/utils/env/isDevEnv"

export function enableSignInDev() {
  return false
  return isDevEnv()
  return false && isDevEnv()
}
