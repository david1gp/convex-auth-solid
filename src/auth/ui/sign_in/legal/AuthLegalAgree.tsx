import { envBaseUrlSiteResult } from "@/app/env/public/envBaseUrlSiteResult"
import type { AuthLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { LinkText } from "~ui/interactive/link/LinkText"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface AuthLegalAgreeProps extends MayHaveClass {
  variant: AuthLegalAgreeVariant
}

export function AuthLegalAgree(p: AuthLegalAgreeProps) {
  const op = "AuthLegalAgree"
  const baseUrlSiteResult = envBaseUrlSiteResult()
  if (!baseUrlSiteResult.success) {
    console.error(op, baseUrlSiteResult.errorMessage)
    return null
  }
  const baseUrlSite = baseUrlSiteResult.data

  const texts = {
    signUp: "By signing up, I agree to the",
    signIn: "By signing in, I agree to the",
  } as const satisfies Record<AuthLegalAgreeVariant, string>

  return (
    <div class={classMerge("text-muted-foreground", p.class)}>
      {texts[p.variant]}
      <LinkText href={baseUrlSite + "/terms"} class="mx-1">
        Terms of Service
      </LinkText>
      and
      <LinkText href={baseUrlSite + "/privacy"} class="mx-1">
        Privacy Policy
      </LinkText>
    </div>
  )
}
