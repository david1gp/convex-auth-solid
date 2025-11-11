import { signInLogic } from "@/auth/ui/sign_in/logic/signInLogic"
import { lazy, onMount } from "solid-js"

export function SignInPageLoader() {
  onMount(() => {
    signInLogic()
  })
  return <SignInPageAsync />
}

const SignInPageAsync = lazy(() => import("@/auth/ui/sign_in/page/SignInPage").then((c) => ({ default: c.SignInPage })))
