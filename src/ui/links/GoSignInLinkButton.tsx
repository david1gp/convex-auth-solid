import { urlPageSignIn } from "@/auth/url/pageRouteAuth"
import { mdiHome } from "@mdi/js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { MayHaveButtonVariantAndClass } from "~ui/utils/MayHaveButtonVariantAndClass"

export function GoSignInLinkButton(p: MayHaveButtonVariantAndClass) {
  return (
    <LinkButton icon={mdiHome} href={urlPageSignIn()} variant={p.variant ?? buttonVariant.outline} class={p.class}>
      {ttt("Go to Sign-In")}
    </LinkButton>
  )
}
