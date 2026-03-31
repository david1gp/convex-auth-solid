import type { SocialLoginProvider } from "#src/auth/model_field/socialLoginProvider.ts"
import { iconGithub } from "#ui/static/icons/iconGithub.ts"
import { iconGoogle } from "#ui/static/icons/iconGoogle.ts"
import { iconMicrosoft } from "#ui/static/icons/iconMicrosoft.ts"

export type SocialProviderButtonProps = {
  background: string
  mdiIconPath: string
}

export const socialProviderButtonProps = {
  // https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/google.ts
  google: {
    background: "#4285F4",
    mdiIconPath: iconGoogle,
  },
  // https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts
  github: {
    background: "#333333",
    mdiIconPath: iconGithub,
  },
  microsoft: {
    background: "",
    mdiIconPath: iconMicrosoft,
  },
} as const satisfies Record<SocialLoginProvider, SocialProviderButtonProps>
