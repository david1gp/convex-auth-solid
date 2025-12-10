import type { SocialLoginProvider } from "@/auth/model/socialLoginProvider"
import { iconGithub } from "@/auth/ui/sign_in/social/iconGithub"
import { iconGoogle } from "@/auth/ui/sign_in/social/iconGoogle"

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
} as const satisfies Record<SocialLoginProvider, SocialProviderButtonProps>
