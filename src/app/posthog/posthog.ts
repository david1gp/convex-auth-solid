import { enablePosthog } from "@/app/config/enablePosthog"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { envPosthogAppIdResult } from "@/app/env/public/envPosthogAppIdResult"
import { envPosthogHostApiResult } from "@/app/env/public/envPosthogHostApiResult"
import { envPosthogHostUiResult } from "@/app/env/public/envPosthogHostUiResult"
import type { UserSession } from "@/auth/model/UserSession"
import posthog, { type PostHog, type PostHogConfig } from "posthog-js"

/**
 * https://posthog.com/docs/product-analytics/identify
 * {@link import("@/ops/monitoring_ui/PosthogMonitoringWrapper.tsx")}
 * {@link import("@/ops/monitoring_ui/identifyUserInBrowserForMonitoring.tsx")}
 * {@link import("@/astro/layouts/head/posthog.ts")}
 */
export function posthogInit(session?: UserSession) {
  if (!enablePosthog()) {
    return
  }

  const modeResult = envEnvModeResult()
  if (!modeResult.success) {
    console.error(modeResult)
    return
  }

  const apiResult = envPosthogHostApiResult()
  if (!apiResult.success) {
    console.error(apiResult)
    return
  }
  const uiResult = envPosthogHostUiResult()
  if (!uiResult.success) {
    console.error(uiResult)
    return
  }
  const idResult = envPosthogAppIdResult()
  if (!idResult.success) {
    console.error(idResult)
    return
  }

  function loaded(posthog: PostHog) {
    if (!session) return
    const user = session.profile
    const distinctId = user.email
    posthog.identify(distinctId, user)
  }

  // https://posthog.com/docs/libraries/js
  const config: Partial<PostHogConfig> = {
    persistence: "localStorage",
    api_host: apiResult.data,
    ui_host: uiResult.data,
    loaded: session ? loaded : undefined,
    advanced_disable_feature_flags_on_first_load: true,
    advanced_disable_feature_flags: true,
    enable_recording_console_log: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    defaults: "2025-11-30",
  }

  // const name = "app" + "/" + modeResult.data
  const name = "app"

  posthog.init(idResult.data, config, name)
}

export function posthogIdentify(session: UserSession) {
  if (!enablePosthog()) {
    return
  }
  const user = session.profile
  const distinctId = user.email ?? user.username ?? user.userId
  posthog.identify(distinctId, user)
}

export function posthogReset() {
  posthog.reset()
}
