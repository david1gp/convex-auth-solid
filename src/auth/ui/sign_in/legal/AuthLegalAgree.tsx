import { envBaseUrlSiteResult } from "#src/app/env/public/envBaseUrlSiteResult.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { authLegalAgreeText, type AuthLegalAgreeVariant } from "#src/auth/ui/sign_in/legal/authLegalAgreeVariant.tsx"
import { LinkText } from "#ui/interactive/link/LinkText.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
