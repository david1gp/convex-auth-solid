import { envBaseUrlSiteResult } from "@/app/env/public/envBaseUrlSiteResult"
import { ttc } from "@/app/i18n/ttc"
import { authLegalAgreeText, type AuthLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
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
  return (
    <div class={classMerge("text-muted-foreground", p.class)}>
      {authLegalAgreeText(p.variant)}
      <LinkText href={baseUrlSite + "/terms"} class="mx-1">
        {ttc("Terms of Service")}
      </LinkText>
      {ttc("and")}
      <LinkText href={baseUrlSite + "/privacy"} class="mx-1">
        {ttc("Privacy Policy")}
      </LinkText>
    </div>
  )
}
