import { getBaseUrlSite } from "@/app/url/getBaseUrl"
import type { AuthLegalAgreeVariant } from "@/auth/ui/sign_in/legal/authLegalAgreeVariant"
import { LinkText } from "~ui/interactive/link/LinkText"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface AuthLegalAgreeProps extends MayHaveClass {
  variant: AuthLegalAgreeVariant
}

export function AuthLegalAgree(p: AuthLegalAgreeProps) {
  const texts = {
    signUp: "By signing up, I agree to the",
    signIn: "By signing in, I agree to the",
  } as const satisfies Record<AuthLegalAgreeVariant, string>

  return (
    <div class={classMerge("text-muted-foreground", p.class)}>
      {texts[p.variant]}
      <LinkText href={getBaseUrlSite() + "/terms"} class="mx-1">
        Terms of Service
      </LinkText>
      and
      <LinkText href={getBaseUrlSite() + "/privacy"} class="mx-1">
        Privacy Policy
      </LinkText>
    </div>
  )
}
