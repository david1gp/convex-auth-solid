import { envEnvModeResult } from "#src/app/env/public/envEnvModeResult.js"

export function isProdEnv() {
  const op = "isProdEnvVite"
  const modeResult = envEnvModeResult()
  if (!modeResult.success) {
    console.error(op, modeResult)
    return false
  }
  return modeResult.data === "production"
}
