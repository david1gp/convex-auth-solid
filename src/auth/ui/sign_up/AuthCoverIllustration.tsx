import { Img } from "~ui/static/img/Img"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function AuthCoverIllustration(p: MayHaveClass) {
  const url = "/img/illustrations/auth/sign_in_1.svg"
  return <Img src={url} alt="Sign up illustration" class={classMerge("hidden lg:flex w-full max-w-3xl", p.class)} />
}
