import { pageNameAuth, type PageNameAuth } from "@/auth/url/pageNameAuth"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { BulletLinksO } from "~ui/interactive/list/BulletLinksO"

export function DemoAuthLinks() {
  const authLinks = [
    { key: "signUp", label: "Sign Up" },
    { key: "signUpConfirmEmail", label: "Sign Up Confirm Email" },
    { key: "signIn", label: "Sign In" },
    { key: "signInEnterOtp", label: "Sign In Enter OTP" },
    { key: "signInError", label: "Sign In Error" },
  ] as const satisfies { key: PageNameAuth; label: string }[]

  const urlObjects = authLinks.reduce(
    (acc, { key, label }) => {
      acc[label] = pageRouteAuth[pageNameAuth[key]]
      return acc
    },
    {} as Record<string, string>,
  )

  return <BulletLinksO urlObject={urlObjects} />
}
