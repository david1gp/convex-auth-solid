import { envEnvModeResult } from "#src/app/env/public/envEnvModeResult.js"

export function isDevEnv() {
  const op = "isDevEnvVite"
  const modeResult = envEnvModeResult()
  if (!modeResult.success) {
    console.error(op, modeResult)
    return false
  }
  return modeResult.data === "development"
}
