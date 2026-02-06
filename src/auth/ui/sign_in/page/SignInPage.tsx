import { ttt } from "~ui/i18n/ttt"
import { NavAuth } from "@/app/nav/NavAuth"
import { SignInPageContent } from "@/auth/ui/sign_in/page/SignInPageContent"
import { SignUpButtonLink } from "@/auth/ui/sign_in/page/SignUpButtonLink"
import { mdiAccountPlus } from "@mdi/js"
import { classesBgGray } from "~ui/classes/classesBg"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"

interface SignInPageContent2Props extends MayHaveClass, MayHaveInnerClass {}

export function SignInPage(p: SignInPageContent2Props) {
  return (
    <LayoutWrapperDemo title={ttt("Sign In")}>
      <div class={classArr("min-h-dvh w-full", classesBgGray, p.class)}>
        <NavAuth title={ttt("Sign In")}>
          <SignUpButtonLink size={buttonSize.default} variant={buttonVariant.link} icon={mdiAccountPlus} iconRight="" />
        </NavAuth>
        <SignInPageContent class={p.innerClass} />
      </div>
    </LayoutWrapperDemo>
  )
}
