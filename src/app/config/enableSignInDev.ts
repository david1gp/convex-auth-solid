import { isDevEnv } from "#src/utils/env/isDevEnv.js"

export function enableSignInDev() {
  return false
  return isDevEnv()
  return false && isDevEnv()
}
