import { lazy, onMount } from "solid-js"
import { signInLogic } from "#src/auth/ui/sign_in/logic/signInLogic.ts"

export function SignInPageLoader() {
  onMount(() => {
    signInLogic()
  })
  return <SignInPageAsync />
}

const SignInPageAsync = lazy(() =>
  import("#src/auth/ui/sign_in/page/SignInPage.tsx").then((c) => ({
    default: c.SignInPage,
  })),
)
