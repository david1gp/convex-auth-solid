import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"

export function enableGithub() {
  // return false
  return isDevEnvVite()
}
