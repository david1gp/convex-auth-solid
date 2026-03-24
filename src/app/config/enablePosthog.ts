import { isProdEnv } from "#src/utils/env/isProdEnv.js"

export function enablePosthog() {
  // return true
  // return false
  return isProdEnv()
}
