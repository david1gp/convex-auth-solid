import { ttc } from "#src/app/i18n/ttc.js"
import { NavAuth } from "#src/app/nav/NavAuth.js"
import { SignInPageContent } from "#src/auth/ui/sign_in/page/SignInPageContent.js"
import { SignUpButtonLink } from "#src/auth/ui/sign_in/page/SignUpButtonLink.js"
import { classesBgGray } from "#ui/classes/classesBg"
import { buttonSize, buttonVariant } from "#ui/interactive/button/buttonCva"
import { LayoutWrapperDemo } from "#ui/static/container/LayoutWrapperDemo"
import { classArr } from "#ui/utils/classArr"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "#ui/utils/MayHaveInnerClass"
import { mdiAccountPlus } from "@mdi/js"

interface SignInPageContent2Props extends MayHaveClass, MayHaveInnerClass {}

export function SignInPage(p: SignInPageContent2Props) {
  return (
    <LayoutWrapperDemo title={ttc("Sign In")}>
      <div class={classArr("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavAuth title={ttc("Sign In")}>
          <SignUpButtonLink size={buttonSize.default} variant={buttonVariant.link} icon={mdiAccountPlus} iconRight="" />
        </NavAuth>
        <SignInPageContent class={p.innerClass} />
      </div>
    </LayoutWrapperDemo>
  )
}
