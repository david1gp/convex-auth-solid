import { envBaseUrlSiteResult } from "@/app/env/public/envBaseUrlSiteResult"
import type { AuthLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { ttt } from "~ui/i18n/ttt"
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
    explicit: ttt("I agree to the"),
    signUp: ttt("By signing up, I agree to the"),
    signIn: ttt("By signing in, I agree to the"),
  } as const satisfies Record<AuthLegalAgreeVariant, string>

  return (
    <div class={classMerge("text-muted-foreground", p.class)}>
      {texts[p.variant]}
      <LinkText href={baseUrlSite + "/terms"} class="mx-1">
        {ttt("Terms of Service")}
      </LinkText>
      {ttt("and")}
      <LinkText href={baseUrlSite + "/privacy"} class="mx-1">
        {ttt("Privacy Policy")}
      </LinkText>
    </div>
  )
}
