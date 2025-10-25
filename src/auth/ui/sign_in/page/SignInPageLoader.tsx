import { signInLogic } from "@/auth/ui/sign_in/logic/signInLogic"
import type { Navigator } from "@solidjs/router"
import { useNavigate, useSearchParams } from "@solidjs/router"
import { createEffect, lazy } from "solid-js"

export function SignInPageLoader() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Redirect to overview if token exists
  createEffect(() => {
    signInLogic(searchParams, navigate as Navigator)
  })

  return <SignInPageAsync />
}

const SignInPageAsync = lazy(() => import("@/auth/ui/sign_in/page/SignInPage").then((c) => ({ default: c.SignInPage })))
