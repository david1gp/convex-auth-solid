import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"

export function isDevEnv() {
  const op = "isDevEnvVite"
  const modeResult = envEnvModeResult()
  if (!modeResult.success) {
    console.error(op, modeResult)
    return false
  }
  return modeResult.data === "development"
}
