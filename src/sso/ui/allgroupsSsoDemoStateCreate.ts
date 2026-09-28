import { createSignalObject } from "#ui/utils/createSignalObject.ts"

/** Does not inspect the live session, redirect, or persist OIDC preference/attempts. */
export function allgroupsSsoDemoStateCreate() {
  const autoSignIn = createSignalObject(false)
  const errorMessage = createSignalObject<string | null>(null)
  return {
    autoSignIn: autoSignIn.get,
    autoSignInToggle: (enabled: boolean) => {
      autoSignIn.set(enabled)
      errorMessage.set("Demo only — automatic sign-in will not start.")
    },
    errorMessage: errorMessage.get,
    isPending: () => false,
    loginClick: () => errorMessage.set("Demo only — no identity provider was contacted."),
  }
}
