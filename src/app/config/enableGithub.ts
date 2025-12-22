import { isDevEnv } from "@/utils/env/isDevEnv"

export function enableGithub() {
  // return false
  return isDevEnv()
}
