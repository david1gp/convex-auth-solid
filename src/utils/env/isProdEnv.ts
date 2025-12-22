import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"

export function isProdEnv() {
  const op = "isProdEnv"
  const modeResult = envEnvModeResult()
  if (!modeResult.success) {
    console.error(op, modeResult)
    return false
  }
  return modeResult.data === "production"
}
