import { signInLogic } from "#src/auth/ui/sign_in/logic/signInLogic.js"
import { lazy, onMount } from "solid-js"

export function SignInPageLoader() {
  onMount(() => {
    signInLogic()
  })
  return <SignInPageAsync />
}

const SignInPageAsync = lazy(() => import("#src/auth/ui/sign_in/page/SignInPage.jsx").then((c) => ({ default: c.SignInPage })))
