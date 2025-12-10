import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"

export function enableSignInDev() {
  return false
  return isDevEnvVite()
  return false && isDevEnvVite()
}
