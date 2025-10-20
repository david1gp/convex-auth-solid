import { useNavigate, useSearchParams } from "@solidjs/router"
import type { Navigator } from "node_modules/@solidjs/router/dist/types"
import { createEffect } from "solid-js"
import { ErrorPage } from "~ui/static/pages/ErrorPage"
import { SuccessPage } from "~ui/static/pages/SuccessPage"
import { signInLogic } from "./logic/signInLogic.js"

export function SignedInPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.token

  // Redirect to overview if token exists
  createEffect(() => {
    signInLogic(searchParams, navigate as Navigator)
  })

  // Show error if no token exists
  if (!token) {
    return (
      <ErrorPage title="Authentication Error" subtitle="No authentication token found. Please try signing in again." />
    )
  }

  // Show success message while redirecting
  return <SuccessPage title="You successfully signed in!" subtitle="You are being redirected to the dashboard" />
}
