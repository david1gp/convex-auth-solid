import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { type PageNameAuth, pageNameAuth } from "#src/auth/url/pageNameAuth.ts"
import { pageRouteAuth } from "#src/auth/url/pageRouteAuth.ts"
import { BulletLinksO } from "#ui/interactive/list/BulletLinksO.jsx"

export function AuthLinks(p: { demo?: boolean } = {}) {
  const authLinks = [
    { key: "signUp", label: "Sign Up" },
    { key: "signUpConfirmEmail", label: "Sign Up Confirm Email" },
    { key: "signIn", label: "Sign In" },
    { key: "signInEnterOtp", label: "Sign In Enter OTP" },
    { key: "signInError", label: "Sign In Error" },
  ] as const satisfies { key: PageNameAuth; label: string }[]

  const urlObjects = authLinks.reduce(
    (acc, { key, label }) => {
      const route = pageRouteAuth[pageNameAuth[key]]
      acc[label] = p.demo
        ? pageDemoHref(
            route as "/sign-up" | "/sign-up-confirm-email" | "/sign-in" | "/sign-in-enter-otp" | "/sign-in-error",
          )
        : route
      return acc
    },
    {} as Record<string, string>,
  )

  return <BulletLinksO urlObject={urlObjects} />
}
