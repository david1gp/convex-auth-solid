import { isDevEnv } from "#src/utils/env/isDevEnv.js"

export function enableGithub() {
  // return false
  return isDevEnv()
}
